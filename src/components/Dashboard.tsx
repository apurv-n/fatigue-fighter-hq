
import React, { useState } from 'react';
import { Users, ClipboardList, Activity, BarChart3, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmployeeManager from './EmployeeManager';
import TaskManager from './TaskManager';
import FatigueMonitor from './FatigueMonitor';
import ReportsAnalytics from './ReportsAnalytics';
import TypingMonitor from './TypingMonitor';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Employee Fatigue Tracker
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor and manage employee wellbeing in real-time</p>
        </div>

        {/* Navigation Tabs - Mobile Responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-4 sm:mb-6 lg:mb-8 h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Employees</span>
              <span className="sm:hidden">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm col-span-2 sm:col-span-1">
              <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm lg:col-span-1 col-span-2 sm:col-span-1">
              <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Typing Monitor</span>
              <span className="sm:hidden">Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm col-span-2 sm:col-span-2 lg:col-span-1">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards - Mobile Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Total Employees</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">24</div>
                  <p className="text-xs opacity-75">+2 from last week</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Active Tasks</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">156</div>
                  <p className="text-xs opacity-75">12 completed today</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Avg Fatigue Score</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">42</div>
                  <p className="text-xs opacity-75">-5 from yesterday</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Breaks Taken</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">89</div>
                  <p className="text-xs opacity-75">Today</p>
                </CardContent>
              </Card>
            </div>
            
            <FatigueMonitor />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManager />
          </TabsContent>

          <TabsContent value="monitor">
            <TypingMonitor />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
