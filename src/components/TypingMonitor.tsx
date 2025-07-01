import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Coffee, RotateCcw, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TypingMonitor = () => {
  const { toast } = useToast();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [fatigueScore, setFatigueScore] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [textInput, setTextInput] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const keystrokeTimestamps = useRef<number[]>([]);
  const lastActivityTime = useRef<number>(Date.now());
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate fatigue based on typing patterns with improved algorithm
  const calculateFatigue = () => {
    const now = Date.now();
    const recentKeystrokes = keystrokeTimestamps.current.filter(
      timestamp => now - timestamp < 60000 // Last minute
    );
    
    const currentWPM = recentKeystrokes.length;
    setWpm(currentWPM);
    
    // Enhanced fatigue calculation
    const sessionDuration = sessionTime / 60; // in minutes
    const inactivityFactor = Math.min((now - lastActivityTime.current) / 1000 / 30, 5); // max 5 points for 30s inactivity
    
    // Calculate typing consistency
    const typingIntervals = [];
    for (let i = 1; i < keystrokeTimestamps.current.length; i++) {
      typingIntervals.push(keystrokeTimestamps.current[i] - keystrokeTimestamps.current[i-1]);
    }
    
    const avgInterval = typingIntervals.length > 0 ? 
      typingIntervals.reduce((a, b) => a + b, 0) / typingIntervals.length : 0;
    
    const inconsistency = typingIntervals.length > 5 ? 
      Math.sqrt(typingIntervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / typingIntervals.length) / 100 : 0;
    
    // Fatigue score calculation (0-100)
    let score = 0;
    score += Math.min(sessionDuration * 1.5, 30); // Session length impact (max 30)
    score += Math.min(inactivityFactor * 8, 25); // Inactivity impact (max 25)
    score += Math.min(inconsistency, 20); // Typing inconsistency (max 20)
    score += Math.min((80 - currentWPM) / 2, 15); // Speed degradation (max 15)
    score += Math.random() * 10; // Random variation for realism (max 10)
    
    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const handleKeyPress = () => {
    if (!isMonitoring || isOnBreak) return;
    
    const now = Date.now();
    keystrokeTimestamps.current.push(now);
    lastActivityTime.current = now;
    setKeystrokes(prev => prev + 1);
    
    // Keep only recent keystrokes (last 5 minutes)
    keystrokeTimestamps.current = keystrokeTimestamps.current.filter(
      timestamp => now - timestamp < 300000
    );
  };

  const createFatigueSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to start monitoring.",
          variant: "destructive"
        });
        return null;
      }

      // Get current employee record
      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!employee) {
        toast({
          title: "Employee Profile Required",
          description: "Please set up your employee profile first.",
          variant: "destructive"
        });
        return null;
      }

      const { data: session, error } = await supabase
        .from('fatigue_sessions')
        .insert({
          employee_id: employee.id,
          session_start: new Date().toISOString(),
          initial_fatigue_score: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        toast({
          title: "Session Error",
          description: "Failed to create monitoring session.",
          variant: "destructive"
        });
        return null;
      }

      return session.id;
    } catch (error) {
      console.error('Error creating fatigue session:', error);
      return null;
    }
  };

  const saveFatigueReading = async (score: number) => {
    if (!currentSessionId) return;

    try {
      await supabase
        .from('fatigue_readings')
        .insert({
          session_id: currentSessionId,
          fatigue_score: score,
          typing_speed: wpm,
          keystroke_pattern: {
            total_keystrokes: keystrokes,
            session_duration: sessionTime,
            recent_wpm: wpm
          }
        });
    } catch (error) {
      console.error('Error saving fatigue reading:', error);
    }
  };

  const endFatigueSession = async () => {
    if (!currentSessionId) return;

    try {
      await supabase
        .from('fatigue_sessions')
        .update({
          session_end: new Date().toISOString(),
          final_fatigue_score: fatigueScore,
          keystrokes_count: keystrokes,
          productivity_score: Math.max(100 - fatigueScore, 0)
        })
        .eq('id', currentSessionId);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const startMonitoring = async () => {
    setLoading(true);
    const sessionId = await createFatigueSession();
    
    if (!sessionId) {
      setLoading(false);
      return;
    }

    setCurrentSessionId(sessionId);
    setIsMonitoring(true);
    setLoading(false);
    lastActivityTime.current = Date.now();
    
    // Main monitoring interval
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
      const newFatigueScore = calculateFatigue();
      setFatigueScore(newFatigueScore);
      
      // Trigger break if fatigue score is too high
      if (newFatigueScore >= 80 && !isOnBreak) {
        triggerBreak();
      }
    }, 1000);

    // Save fatigue readings every 30 seconds
    saveIntervalRef.current = setInterval(() => {
      saveFatigueReading(fatigueScore);
    }, 30000);

    toast({
      title: "Monitoring Started",
      description: "Your typing patterns are now being monitored.",
    });
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
    
    await endFatigueSession();
    
    toast({
      title: "Monitoring Stopped",
      description: "Session data has been saved.",
    });
  };

  const resetSession = async () => {
    await stopMonitoring();
    setFatigueScore(0);
    setSessionTime(0);
    setKeystrokes(0);
    setWpm(0);
    setTextInput('');
    setCurrentSessionId(null);
    keystrokeTimestamps.current = [];
    
    toast({
      title: "Session Reset",
      description: "Ready to start a new monitoring session.",
    });
  };

  const triggerBreak = async () => {
    setIsOnBreak(true);
    setBreakTimeLeft(20);
    
    // Save break record
    if (currentSessionId) {
      try {
        await supabase
          .from('breaks')
          .insert({
            session_id: currentSessionId,
            break_type: 'automatic',
            reason: 'High fatigue detected'
          });
      } catch (error) {
        console.error('Error saving break:', error);
      }
    }
    
    toast({
      title: "Break Time!",
      description: "Your fatigue score is high. Please take a 20-second break.",
      duration: 5000,
    });

    breakIntervalRef.current = setInterval(() => {
      setBreakTimeLeft(prev => {
        if (prev <= 1) {
          setIsOnBreak(false);
          if (breakIntervalRef.current) {
            clearInterval(breakIntervalRef.current);
          }
          toast({
            title: "Break Complete",
            description: "You can resume your work now.",
          });
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getFatigueLevel = (score: number) => {
    if (score < 40) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (score < 70) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-500' };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breakIntervalRef.current) clearInterval(breakIntervalRef.current);
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  const fatigueLevel = getFatigueLevel(fatigueScore);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Typing Monitor</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Controls and Stats */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Coffee className="w-4 h-4 md:w-5 md:h-5" />
                Session Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                {!isMonitoring ? (
                  <Button 
                    onClick={startMonitoring}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isOnBreak || loading}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {loading ? 'Starting...' : 'Start'}
                  </Button>
                ) : (
                  <Button 
                    onClick={stopMonitoring}
                    variant="outline"
                    className="flex-1"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
                <Button 
                  onClick={resetSession}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              {isOnBreak && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Coffee className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-base md:text-lg font-bold text-orange-800">
                    Break Time
                  </div>
                  <div className="text-xl md:text-2xl font-mono text-orange-600">
                    {breakTimeLeft}s
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs md:text-sm">Session Time</div>
                  <div className="text-lg md:text-xl font-mono">{formatTime(sessionTime)}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs md:text-sm">Keystrokes</div>
                  <div className="text-lg md:text-xl font-mono">{keystrokes}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs md:text-sm">WPM</div>
                  <div className="text-lg md:text-xl font-mono">{wpm}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs md:text-sm">Status</div>
                  <Badge className={`${fatigueLevel.color} ${fatigueLevel.bgColor.replace('bg-', 'bg-').replace('-500', '-100')} text-xs`}>
                    {isOnBreak ? 'On Break' : fatigueLevel.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fatigue Monitor */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base md:text-lg">
                <span>Fatigue Score</span>
                <span className={`text-2xl md:text-3xl font-bold ${fatigueLevel.color}`}>
                  {fatigueScore}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={fatigueScore} 
                  className="h-3 md:h-4"
                />
                
                {fatigueScore >= 80 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Coffee className="w-5 h-5 md:w-6 md:h-6 text-red-600 mr-3" />
                      <div>
                        <div className="font-medium text-red-800 text-sm md:text-base">
                          High Fatigue Detected!
                        </div>
                        <div className="text-xs md:text-sm text-red-600">
                          Your typing patterns indicate high fatigue. Consider taking a break.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Typing Area</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Start typing here to monitor your fatigue levels in real-time..."
                className="min-h-[150px] md:min-h-[200px] text-sm md:text-lg"
                disabled={isOnBreak || !isMonitoring}
              />
              <div className="mt-2 text-xs md:text-sm text-gray-500">
                {isOnBreak 
                  ? "Typing disabled during break time" 
                  : !isMonitoring 
                    ? "Click Start to begin monitoring"
                    : "Your typing patterns are being analyzed for fatigue detection"
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TypingMonitor;
