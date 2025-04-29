import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types';
import {
  ShieldCheck,
  LogOut,
  Cloud,
  HardDrive,
  Key,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import ResetPasswordModal from './ResetPasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const openResetModal = () => setIsResetModalOpen(true);
  const closeResetModal = () => setIsResetModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-8 border border-slate-700/50 mx-auto text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl"></div>

        <div className="flex items-center space-x-4 relative">
          <div className="bg-gradient-to-br from-emerald-400 to-cyan-400 p-3 rounded-lg">
            <ShieldCheck className="w-7 h-7 text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user.email?.split('@')[0] || 'Cherry'}
            </h1>
            <div className="flex items-center mt-1">
  <Cloud className="w-4 h-4 text-blue-400 mr-1.5" />
  <span className="text-sm text-blue-400">Cloud Storage</span>
</div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <InfoCard title="Email Address" value={user.email || 'cherrychhallani@gmail.com'} icon="mail" />
          <InfoCard title="IP Address" value={user.ipAddress || '172.29.1.214'} icon="network" />
        </div>

        <div className="space-y-4 relative">
          <h2 className="text-lg font-semibold text-slate-300">Account Settings</h2>

          <button
            onClick={openResetModal}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/70 hover:bg-slate-700 rounded-lg transition duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Reset Password</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={openDeleteModal}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-700/70 hover:bg-red-900/30 rounded-lg transition duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <span className="font-medium">Delete Account</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-300 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="pt-2 relative">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition duration-300 shadow-md"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <ResetPasswordModal isOpen={isResetModalOpen} onClose={closeResetModal} />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        email={user.email}
      />
    </div>
  );
};

interface InfoCardProps {
  title: string;
  value: string;
  icon: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <div className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition duration-300">
    <p className="text-sm text-slate-400 mb-1">{title}</p>
    <p className="text-lg font-medium break-all">{value}</p>
  </div>
);

export default Profile;
