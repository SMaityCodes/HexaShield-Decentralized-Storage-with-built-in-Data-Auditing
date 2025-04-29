import { Link, useNavigate, Outlet } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import React, { useState } from 'react';
import { User, File } from '../types';
import {
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Shield,
  RefreshCw,
  Copy,
  Send,
  FileCheck,
  AlertTriangle,
  Home,
  Eye,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [files, setFiles] = useState<File[]>([
    {
      id: '1',
      name: 'financial-report-2024.pdf',
      uploadedBy: 'cloud-admin',
      status: 'approved',
      lastModified: '2024-03-15',
      size: '2.5 MB',
      location: 'cloud',
      hasCopy: true,
      integrityStatus: 'verified',
    },
    {
      id: '2',
      name: 'customer-data.xlsx',
      uploadedBy: 'cloud-admin',
      status: 'approved',
      lastModified: '2024-03-14',
      size: '1.8 MB',
      location: 'both',
      hasCopy: true,
      integrityStatus: 'mismatch',
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: File = {
        id: Date.now().toString(),
        name: file.name,
        uploadedBy: user.username,
        status: 'approved',
        lastModified: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        location: 'cloud',
        hasCopy: false,
      };
      setFiles([...files, newFile]);
    }
  };

  const generateCopy = (fileId: string) => {
    setFiles(files.map(file => file.id === fileId ? { ...file, hasCopy: true } : file));
  };

  const sendToLocal = (fileId: string) => {
    setFiles(files.map(file => file.id === fileId ? { ...file, location: 'both' } : file));
  };

  const checkIntegrity = (fileId: string) => {
    setFiles(files.map(file =>
      file.id === fileId
        ? {
            ...file,
            integrityStatus: Math.random() > 0.5 ? 'verified' : 'mismatch',
          }
        : file
    ));
  };

  const getIntegrityIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'mismatch':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/dashboard/profile'); // ✅ correct route within dashboard layout
  };
  

  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-6 border-r border-slate-700 flex flex-col space-y-6">
        <div className="flex items-center space-x-3 mb-5">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl font-bold">Hexashield</h1>
        </div>

        <nav className="flex flex-col space-y-6 text-slate-300">
          <div onClick={() => navigate('/')} className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </div>

          <div onClick={() => navigate('upload')} className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Upload File</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </div>

          <div onClick={() => navigate('view')} className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <Eye className="w-5 h-5" />
            <span>View Files</span>
          </div>

          <div onClick={() => navigate('metadata')} className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <Layers className="w-5 h-5" />
            <span>Send/Generate Metadata</span>
          </div>

          <div onClick={() => navigate('verify')} className="flex items-center space-x-2 hover:text-white cursor-pointer">
            <ShieldCheck className="w-5 h-5" />
            <span>Verification of File</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-500 mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold -mt-5">Cloud Management</h2>
          <button
  onClick={goToProfile}
  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 rounded-full hover:bg-slate-600 transition"
  title="Profile"
>
  <UserCircle className="w-6 h-6 text-white" />
</button>

        </div>

        {/* Your main table & file actions remain unchanged */}
        {/* <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">File Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Location</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Last Modified</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Size</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Backup Copy</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Integrity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-slate-700 last:border-0 hover:bg-slate-700/50">
                  <td className="px-6 py-4 min-w-[200px]">{file.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        file.location === 'both'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {file.location === 'both' ? 'Cloud & Local' : 'Cloud Only'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{file.lastModified}</td>
                  <td className="px-6 py-4 text-slate-400">{file.size}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center space-x-2 ${
                        file.hasCopy ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      <span>{file.hasCopy ? 'Generated' : 'Not Generated'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 min-w-[140px]">
                    {file.location === 'both' && (
                      <div className="flex items-center space-x-2">
                        {getIntegrityIcon(file.integrityStatus)}
                        <span className="capitalize">{file.integrityStatus || 'unverified'}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {!file.hasCopy && (
                        <button
                          onClick={() => generateCopy(file.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                          title="Generate Backup Copy"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                      )}
                      {file.hasCopy && file.location === 'cloud' && (
                        <button
                          onClick={() => sendToLocal(file.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition"
                          title="Send to Local Storage"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send</span>
                        </button>
                      )}
                      {file.location === 'both' && (
                        <button
                          onClick={() => checkIntegrity(file.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition"
                          title="Check Integrity"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Verify</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Nested Routes Render Here */}
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
