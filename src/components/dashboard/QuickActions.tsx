
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Coffee, UserPlus, FileText, Settings } from 'lucide-react';

interface QuickActionsProps {
  onStartSession: () => void;
  onTakeBreak: () => void;
  onAddEmployee: () => void;
  onCreateTask: () => void;
  onOpenSettings: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onStartSession,
  onTakeBreak,
  onAddEmployee,
  onCreateTask,
  onOpenSettings
}) => {
  const actions = [
    {
      title: "Start Monitoring",
      description: "Begin fatigue tracking session",
      icon: Play,
      onClick: onStartSession,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Take Break",
      description: "Schedule immediate break",
      icon: Coffee,
      onClick: onTakeBreak,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Add Employee",
      description: "Register new team member",
      icon: UserPlus,
      onClick: onAddEmployee,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Create Task",
      description: "Assign new task",
      icon: FileText,
      onClick: onCreateTask,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Settings",
      description: "Configure system preferences",
      icon: Settings,
      onClick: onOpenSettings,
      color: "from-gray-500 to-gray-600"
    }
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 md:p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-gray-50 to-white"
                onClick={action.onClick}
              >
                <div className={`p-2 md:p-3 rounded-full bg-gradient-to-r ${action.color}`}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs md:text-sm text-gray-900">{action.title}</div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
