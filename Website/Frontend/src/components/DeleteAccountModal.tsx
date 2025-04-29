import React, { useState } from 'react';
import { ModalProps } from '../types';
import { X, Trash2, AlertTriangle, Loader } from 'lucide-react';

interface DeleteAccountModalProps extends ModalProps {
  email: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, email }) => {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleDeleteAccount = () => {
    if (confirmEmail !== email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      
      // In a real application, you would handle the account deletion and redirect to login/homepage
      alert('Account deleted successfully');
    }, 2000);
  };
  
  const isValid = confirmEmail === email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-red-500/10 p-3 rounded-full mx-auto mb-4 inline-block">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white">Delete Account</h2>
          <p className="text-slate-400 mt-2">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
        
        <div className="space-y-5">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h3 className="text-red-400 font-medium mb-2">Please read carefully:</h3>
            <ul className="text-sm text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Your account will be permanently deleted</li>
              <li>All your data and settings will be lost</li>
              <li>You will not be able to recover your account</li>
              <li>Any active subscriptions will be canceled</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Confirm by typing your email: <span className="font-bold">{email}</span>
            </label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>
          
          <button
            onClick={handleDeleteAccount}
            disabled={!isValid || isLoading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 rounded-lg transition duration-200 font-medium text-white"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                <span>Permanently Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;