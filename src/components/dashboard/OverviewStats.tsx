
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Coffee, TrendingUp, Users, AlertTriangle } from 'lucide-react';

const OverviewStats = () => {
  const stats = [
    {
      title: "Team Average Fatigue",
      value: "42%",
      change: "-8% from yesterday",
      trend: "down",
      icon: Activity,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Active Sessions",
      value: "12",
      change: "3 new today",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Total Break Time",
      value: "2.4h",
      change: "+15% from yesterday",
      trend: "up",
      icon: Coffee,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Productivity Score",
      value: "87%",
      change: "+3% from yesterday",
      trend: "up",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Average Session Time",
      value: "6.2h",
      change: "Within healthy range",
      trend: "stable",
      icon: Clock,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "High Fatigue Alerts",
      value: "3",
      change: "-2 from yesterday",
      trend: "down",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-xl backdrop-blur-lg bg-white/80 hover:bg-white/90 transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 md:p-2 rounded-full bg-gradient-to-r ${stat.color} shadow-lg backdrop-blur-sm`}>
                <Icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-600' : 
                stat.trend === 'down' ? 'text-red-600' : 
                'text-gray-500'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OverviewStats;
