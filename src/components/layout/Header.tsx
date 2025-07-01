
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Settings, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onNotificationClick: () => void;
  onMenuClick: () => void;
  unreadCount: number;
}

const Header: React.FC<HeaderProps> = ({ onNotificationClick, onMenuClick, unreadCount }) => {
  const { user, signOut } = useAuth();

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden p-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs md:text-sm">FF</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Fatigue Fighter HQ</h1>
            <p className="text-xs text-gray-500 hidden md:block">Wellness & Productivity Platform</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-bold text-gray-900">FF HQ</h1>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNotificationClick}
          className="relative p-2"
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs p-0 bg-red-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full p-0">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src="" alt={user?.email || ''} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs md:text-sm">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 md:w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Employee Account
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
