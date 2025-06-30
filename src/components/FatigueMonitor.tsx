
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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-time Fatigue Monitor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((employee) => {
          const fatigueLevel = getFatigueLevel(employee.currentScore);
          
          return (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{employee.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {getTrendIcon(employee.trend)}
                    <Badge className={`${fatigueLevel.color} ${fatigueLevel.bgColor}`}>
                      {fatigueLevel.level} Fatigue
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {employee.currentScore}
                  </div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Fatigue Level</span>
                      <span className={fatigueLevel.color}>{employee.currentScore}%</span>
                    </div>
                    <Progress 
                      value={employee.currentScore} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Last Break</div>
                      <div className="font-medium">{employee.lastBreak}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Working Since</div>
                      <div className="font-medium">{employee.workingSince}</div>
                    </div>
                  </div>
                  
                  {employee.currentScore >= 80 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-red-800">
                            High Fatigue Alert
                          </div>
                          <div className="text-xs text-red-600">
                            Break recommended immediately
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FatigueMonitor;
