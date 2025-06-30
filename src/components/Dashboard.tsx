
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
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left px-2 sm:px-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">
            Employee Fatigue Tracker
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto sm:mx-0">
            Monitor and manage employee wellbeing in real-time
          </p>
        </div>

        {/* Navigation Tabs - Mobile Responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2 mb-4 sm:mb-6 lg:mb-8">
            <TabsList className="flex w-max min-w-full sm:grid sm:w-full sm:grid-cols-5 h-auto p-1 bg-white/80 backdrop-blur-sm border shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="flex flex-col items-center gap-1 p-3 sm:p-2 lg:p-3 text-xs sm:text-sm min-w-[80px] sm:min-w-0 whitespace-nowrap data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <Activity className="w-4 h-4 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="employees" 
                className="flex flex-col items-center gap-1 p-3 sm:p-2 lg:p-3 text-xs sm:text-sm min-w-[80px] sm:min-w-0 whitespace-nowrap data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <Users className="w-4 h-4 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                <span>Staff</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="flex flex-col items-center gap-1 p-3 sm:p-2 lg:p-3 text-xs sm:text-sm min-w-[80px] sm:min-w-0 whitespace-nowrap data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <ClipboardList className="w-4 h-4 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                <span>Tasks</span>
              </TabsTrigger>
              <TabsTrigger 
                value="monitor" 
                className="flex flex-col items-center gap-1 p-3 sm:p-2 lg:p-3 text-xs sm:text-sm min-w-[80px] sm:min-w-0 whitespace-nowrap data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <Monitor className="w-4 h-4 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                <span>Monitor</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex flex-col items-center gap-1 p-3 sm:p-2 lg:p-3 text-xs sm:text-sm min-w-[80px] sm:min-w-0 whitespace-nowrap data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                <BarChart3 className="w-4 h-4 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                <span>Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0">
            {/* Stats Cards - Mobile Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Total Employees</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">24</div>
                  <p className="text-xs opacity-75 mt-1">+2 from last week</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Active Tasks</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">156</div>
                  <p className="text-xs opacity-75 mt-1">12 completed today</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Avg Fatigue Score</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">42</div>
                  <p className="text-xs opacity-75 mt-1">-5 from yesterday</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium opacity-90">Breaks Taken</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold">89</div>
                  <p className="text-xs opacity-75 mt-1">Today</p>
                </CardContent>
              </Card>
            </div>
            
            <FatigueMonitor />
          </TabsContent>

          <TabsContent value="employees" className="mt-0">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <TaskManager />
          </TabsContent>

          <TabsContent value="monitor" className="mt-0">
            <TypingMonitor />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
