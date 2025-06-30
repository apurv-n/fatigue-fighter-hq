
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Dashboard />
    </div>
  );
};

export default Index;
