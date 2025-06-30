
import React, { useState } from 'react';
import { Calendar, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ReportsAnalytics = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  // Sample data for charts
  const dailyFatigueData = [
    { day: 'Mon', fatigue: 35, breaks: 8 },
    { day: 'Tue', fatigue: 42, breaks: 12 },
    { day: 'Wed', fatigue: 38, breaks: 10 },
    { day: 'Thu', fatigue: 55, breaks: 15 },
    { day: 'Fri', fatigue: 48, breaks: 13 },
    { day: 'Sat', fatigue: 28, breaks: 6 },
    { day: 'Sun', fatigue: 22, breaks: 4 }
  ];

  const weeklyFatigueData = [
    { week: 'Week 1', john: 45, jane: 52, mike: 38, sarah: 41 },
    { week: 'Week 2', john: 38, jane: 46, mike: 55, sarah: 33 },
    { week: 'Week 3', john: 42, jane: 48, mike: 62, sarah: 39 },
    { week: 'Week 4', john: 35, jane: 44, mike: 58, sarah: 42 }
  ];

  const employeeStats = [
    {
      name: 'John Doe',
      avgFatigue: 35,
      trend: 'down',
      breaksToday: 8,
      totalHours: 42,
      efficiency: 92
    },
    {
      name: 'Jane Smith',
      avgFatigue: 48,
      trend: 'stable',
      breaksToday: 12,
      totalHours: 38,
      efficiency: 87
    },
    {
      name: 'Mike Johnson',
      avgFatigue: 58,
      trend: 'up',
      breaksToday: 15,
      totalHours: 35,
      efficiency: 78
    },
    {
      name: 'Sarah Wilson',
      avgFatigue: 42,
      trend: 'down',
      breaksToday: 10,
      totalHours: 40,
      efficiency: 89
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <div className="w-4 h-4 bg-yellow-500 rounded-full" />;
    }
  };

  const getFatigueColor = (score: number) => {
    if (score < 40) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="sarah">Sarah Wilson</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Avg Fatigue Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">46</div>
            <p className="text-xs opacity-75">-3 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Total Breaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">245</div>
            <p className="text-xs opacity-75">This week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium opacity-90">High Fatigue Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-xs opacity-75">-8 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Avg Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">86%</div>
            <p className="text-xs opacity-75">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Daily Fatigue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Daily Fatigue & Breaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyFatigueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="fatigue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Fatigue Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="breaks" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Breaks Taken"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Weekly Employee Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyFatigueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="john" fill="#3b82f6" name="John" />
                <Bar dataKey="jane" fill="#10b981" name="Jane" />
                <Bar dataKey="mike" fill="#f59e0b" name="Mike" />
                <Bar dataKey="sarah" fill="#8b5cf6" name="Sarah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            Employee Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {employeeStats.map((employee, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base truncate">{employee.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {employee.totalHours}h worked this week
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Avg Fatigue</div>
                    <div className={`font-bold text-sm ${getFatigueColor(employee.avgFatigue)}`}>
                      {employee.avgFatigue}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Trend</div>
                    <div className="flex justify-center">
                      {getTrendIcon(employee.trend)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Breaks Today</div>
                    <div className="font-bold text-sm">{employee.breaksToday}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-gray-500 text-xs">Efficiency</div>
                    <Badge className={`text-xs ${
                      employee.efficiency >= 90 
                        ? 'bg-green-100 text-green-800'
                        : employee.efficiency >= 80
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.efficiency}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
