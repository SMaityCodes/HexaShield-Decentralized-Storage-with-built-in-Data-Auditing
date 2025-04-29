import React, { useState } from 'react';
import { User } from '../types';
import { Cloud, Database } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [role, setRole] = useState<'cloud' | 'local'>('cloud');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password, role }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Login failed');
      }
      const { token, user } = await res.json();
      onLogin({ ...user, token });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-8">
      <div className="flex justify-center space-x-4 mb-8">
        <button
          type="button"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            role === 'cloud'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          onClick={() => setRole('cloud')}
        >
          <Cloud className="w-5 h-5" />
          <span>Cloud Admin</span>
        </button>
        <button
          type="button"
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
            role === 'local'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          onClick={() => setRole('local')}
        >
          <Database className="w-5 h-5" />
          <span>Local Storage</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
