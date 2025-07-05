
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Keyboard, 
  ClipboardList, 
  Settings,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'monitor', label: 'Fatigue Monitor', icon: Activity },
    { id: 'typing', label: 'Typing Monitor', icon: Keyboard },
    { id: 'employees', label: 'Employee Manager', icon: Users },
    { id: 'tasks', label: 'Task Manager', icon: ClipboardList },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 backdrop-blur-lg bg-white/80 border-r border-white/30 flex flex-col h-full shadow-xl">
      <nav className="flex-1 px-3 md:px-4 py-4 md:py-6 space-y-1 md:space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-10 md:h-11 text-sm font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg backdrop-blur-sm border border-white/20" 
                  : "text-gray-700 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-md"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">{item.label}</span>
            </Button>
          );
        })}
      </nav>
      
      <div className="p-3 md:p-4 border-t border-white/30">
        <div className="backdrop-blur-md bg-gradient-to-r from-blue-50/80 to-purple-50/80 p-3 md:p-4 rounded-xl border border-white/30 shadow-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Pro Tip</h4>
          <p className="text-xs text-gray-600">
            Take regular breaks to maintain optimal productivity and wellness.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
