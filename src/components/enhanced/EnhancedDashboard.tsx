
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';
import OverviewStats from '../dashboard/OverviewStats';
import QuickActions from '../dashboard/QuickActions';
import RecentActivities from '../dashboard/RecentActivities';
import NotificationCenter from '../notifications/NotificationCenter';
import FatigueMonitor from '../FatigueMonitor';
import TypingMonitor from '../TypingMonitor';
import EmployeeManager from '../EmployeeManager';
import TaskManager from '../TaskManager';
import ReportsAnalytics from '../ReportsAnalytics';
import SettingsPage from '../settings/SettingsPage';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = 2;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'start':
        setActiveTab('typing');
        break;
      case 'break':
        // Trigger break logic here
        break;
      case 'employee':
        setActiveTab('employees');
        break;
      case 'task':
        setActiveTab('tasks');
        break;
      case 'settings':
        setActiveTab('settings');
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your team's wellness today.
              </p>
            </div>
            
            <OverviewStats />
            
            <QuickActions
              onStartSession={() => handleQuickAction('start')}
              onTakeBreak={() => handleQuickAction('break')}
              onAddEmployee={() => handleQuickAction('employee')}
              onCreateTask={() => handleQuickAction('task')}
              onOpenSettings={() => handleQuickAction('settings')}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivities />
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wellness Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">Take a 5-minute break every hour to maintain focus</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">Practice the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">Stay hydrated throughout the day to maintain energy levels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'monitor':
        return <FatigueMonitor />;
      case 'typing':
        return <TypingMonitor />;
      case 'employees':
        return <EmployeeManager />;
      case 'tasks':
        return <TaskManager />;
      case 'analytics':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onNotificationClick={() => setShowNotifications(true)}
        unreadCount={unreadNotifications}
      />
      
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default EnhancedDashboard;
