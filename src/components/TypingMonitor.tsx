import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Coffee, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const keystrokeTimestamps = useRef<number[]>([]);
  const lastActivityTime = useRef<number>(Date.now());

  // Calculate fatigue based on typing patterns
  const calculateFatigue = () => {
    const now = Date.now();
    const recentKeystrokes = keystrokeTimestamps.current.filter(
      timestamp => now - timestamp < 60000 // Last minute
    );
    
    const currentWPM = recentKeystrokes.length;
    setWpm(currentWPM);
    
    // Fatigue factors
    const sessionDuration = sessionTime / 60; // in minutes
    const inactivityFactor = Math.min((now - lastActivityTime.current) / 1000 / 60, 10); // max 10 minutes
    const speedVariation = Math.abs(currentWPM - wpm) / Math.max(wpm, 1);
    
    // Calculate fatigue score (0-100)
    let score = 0;
    score += Math.min(sessionDuration * 2, 40); // Session length impact (max 40)
    score += Math.min(inactivityFactor * 5, 30); // Inactivity impact (max 30)
    score += Math.min(speedVariation * 50, 20); // Speed variation impact (max 20)
    score += Math.random() * 10; // Random variation for realism
    
    return Math.min(Math.round(score), 100);
  };

  const handleKeyPress = () => {
    if (!isMonitoring || isOnBreak) return;
    
    const now = Date.now();
    keystrokeTimestamps.current.push(now);
    lastActivityTime.current = now;
    setKeystrokes(prev => prev + 1);
    
    // Keep only recent keystrokes
    keystrokeTimestamps.current = keystrokeTimestamps.current.filter(
      timestamp => now - timestamp < 300000 // Last 5 minutes
    );
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    lastActivityTime.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
      const newFatigueScore = calculateFatigue();
      setFatigueScore(newFatigueScore);
      
      // Trigger break if fatigue score is too high
      if (newFatigueScore >= 80 && !isOnBreak) {
        triggerBreak();
      }
    }, 1000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetSession = () => {
    stopMonitoring();
    setFatigueScore(0);
    setSessionTime(0);
    setKeystrokes(0);
    setWpm(0);
    setTextInput('');
    keystrokeTimestamps.current = [];
  };

  const triggerBreak = () => {
    setIsOnBreak(true);
    setBreakTimeLeft(20);
    stopMonitoring();
    
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
    };
  }, []);

  const fatigueLevel = getFatigueLevel(fatigueScore);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Typing Monitor</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                Session Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                {!isMonitoring ? (
                  <Button 
                    onClick={startMonitoring}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isOnBreak}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button 
                    onClick={stopMonitoring}
                    variant="outline"
                    className="flex-1"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button 
                  onClick={resetSession}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              {isOnBreak && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Coffee className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-orange-800">
                    Break Time
                  </div>
                  <div className="text-2xl font-mono text-orange-600">
                    {breakTimeLeft}s
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Session Time</div>
                  <div className="text-xl font-mono">{formatTime(sessionTime)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Keystrokes</div>
                  <div className="text-xl font-mono">{keystrokes}</div>
                </div>
                <div>
                  <div className="text-gray-500">WPM</div>
                  <div className="text-xl font-mono">{wpm}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <Badge className={`${fatigueLevel.color} ${fatigueLevel.bgColor.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                    {isOnBreak ? 'On Break' : fatigueLevel.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fatigue Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Fatigue Score</span>
                <span className={`text-3xl font-bold ${fatigueLevel.color}`}>
                  {fatigueScore}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress 
                  value={fatigueScore} 
                  className="h-4"
                />
                
                {fatigueScore >= 80 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Coffee className="w-6 h-6 text-red-600 mr-3" />
                      <div>
                        <div className="font-medium text-red-800">
                          High Fatigue Detected!
                        </div>
                        <div className="text-sm text-red-600">
                          Your typing patterns indicate high fatigue. Consider taking a break.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typing Area</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Start typing here to monitor your fatigue levels in real-time..."
                className="min-h-[200px] text-lg"
                disabled={isOnBreak || !isMonitoring}
              />
              <div className="mt-2 text-sm text-gray-500">
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
