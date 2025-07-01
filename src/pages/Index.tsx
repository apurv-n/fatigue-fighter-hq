
import React from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import AuthPage from '../components/auth/AuthPage';
import EnhancedDashboard from '../components/enhanced/EnhancedDashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">FF</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
            <div className="w-16 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return user ? <EnhancedDashboard /> : <AuthPage />;
};

export default Index;
