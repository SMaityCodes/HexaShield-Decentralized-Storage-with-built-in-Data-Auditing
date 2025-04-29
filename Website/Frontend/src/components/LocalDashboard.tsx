import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HardDrive, LogOut, Home as HomeIcon } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  onLogout: () => void;
}

function LocalDashboard({ user, onLogout }: Props) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex">
      <div className="w-64 bg-slate-800 p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-8">
          <HardDrive className="text-emerald-500" />
          <h1 className="text-xl font-bold">Local Storage</h1>
        </div>

        <div className="mb-6">
          <div className="text-sm text-slate-400 mb-2">Welcome, {user.username}</div>
          <div className="text-xs bg-slate-700 py-1 px-2 rounded-full inline-block text-emerald-400">
            Local Server
          </div>
        </div>

        <nav className="space-y-1">
          <Link 
            to="/local-dashboard" 
            className={`flex items-center space-x-2 p-2 rounded-lg ${location.pathname === '/local-dashboard' ? 'bg-slate-700 text-emerald-500' : 'hover:bg-slate-700/50'}`}
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>
        </nav>

        <div className="absolute bottom-8 left-8">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 text-slate-400 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default LocalDashboard;