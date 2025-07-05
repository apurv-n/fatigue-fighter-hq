
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coffee, AlertTriangle, CheckCircle, User } from 'lucide-react';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: 'break',
      user: 'John Doe',
      action: 'took a break',
      time: '2 minutes ago',
      icon: Coffee,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 2,
      type: 'alert',
      user: 'Jane Smith',
      action: 'high fatigue detected',
      time: '5 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: 3,
      type: 'session',
      user: 'Mike Johnson',
      action: 'started monitoring session',
      time: '10 minutes ago',
      icon: Clock,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 4,
      type: 'task',
      user: 'Sarah Wilson',
      action: 'completed task',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 5,
      type: 'user',
      user: 'Alex Chen',
      action: 'joined the team',
      time: '1 hour ago',
      icon: User,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <Card className="shadow-xl border-0 backdrop-blur-lg bg-white/80">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-xl backdrop-blur-sm bg-white/60 hover:bg-white/80 transition-all duration-200 hover:shadow-md">
                <div className={`p-1.5 md:p-2 rounded-full ${activity.color} backdrop-blur-sm shadow-sm`}>
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-white/70">
                  {activity.type}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
