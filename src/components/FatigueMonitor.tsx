
import React from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface EmployeeFatigue {
  id: string;
  name: string;
  currentScore: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastBreak: string;
  workingSince: string;
}

const FatigueMonitor = () => {
  const employees: EmployeeFatigue[] = [
    {
      id: '1',
      name: 'John Doe',
      currentScore: 35,
      trend: 'stable',
      lastBreak: '2 hours ago',
      workingSince: '9:00 AM'
    },
    {
      id: '2',
      name: 'Jane Smith',
      currentScore: 62,
      trend: 'increasing',
      lastBreak: '45 min ago',
      workingSince: '8:30 AM'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      currentScore: 85,
      trend: 'increasing',
      lastBreak: '3 hours ago',
      workingSince: '8:00 AM'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      currentScore: 28,
      trend: 'decreasing',
      lastBreak: '30 min ago',
      workingSince: '9:15 AM'
    }
  ];

  const getFatigueLevel = (score: number) => {
    if (score < 40) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score < 70) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-2 sm:px-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
          Real-time Fatigue Monitor
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {employees.map((employee) => {
          const fatigueLevel = getFatigueLevel(employee.currentScore);
          
          return (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md bg-white/90 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 sm:pb-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-semibold truncate">
                    {employee.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    {getTrendIcon(employee.trend)}
                    <Badge 
                      variant="secondary"
                      className={`${fatigueLevel.color} ${fatigueLevel.bgColor} text-xs px-2 py-1 font-medium border-0`}
                    >
                      {fatigueLevel.level} Fatigue
                    </Badge>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {employee.currentScore}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">/ 100</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Fatigue Level</span>
                    <span className={`${fatigueLevel.color} font-medium`}>
                      {employee.currentScore}%
                    </span>
                  </div>
                  <Progress 
                    value={employee.currentScore} 
                    className="h-2 sm:h-3"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs sm:text-sm">Last Break</div>
                    <div className="font-medium text-sm sm:text-base truncate">
                      {employee.lastBreak}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs sm:text-sm">Working Since</div>
                    <div className="font-medium text-sm sm:text-base">
                      {employee.workingSince}
                    </div>
                  </div>
                </div>
                
                {employee.currentScore >= 80 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-red-800">
                          High Fatigue Alert
                        </div>
                        <div className="text-xs sm:text-sm text-red-600 mt-1">
                          Break recommended immediately
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FatigueMonitor;
