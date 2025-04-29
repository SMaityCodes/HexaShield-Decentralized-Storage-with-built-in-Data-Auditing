import React, { useState } from 'react';
import { HardDrive, Files, ArrowRight } from 'lucide-react';

function LocalStoragePage() {
  const [storageStats, setStorageStats] = useState({
    totalSpace: '500 GB',
    usedSpace: '120 GB',
    availableSpace: '380 GB',
    fileCount: 24
  });

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <HardDrive className="mr-2 text-emerald-500" /> 
          Local Storage
        </h1>
        <p className="text-slate-400 mt-1">
          Manage and monitor your local fog storage node
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Storage Statistics</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Total Space</span>
                <span className="text-white">{storageStats.totalSpace}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Used Space</span>
                <span className="text-white">{storageStats.usedSpace}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Available Space</span>
                <span className="text-white">{storageStats.availableSpace}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-700 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Files Stored</span>
                <span className="bg-slate-700 px-2 py-1 rounded text-white text-sm">
                  {storageStats.fileCount}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Storage Actions</h2>
          
          <div className="space-y-4">
            <a 
              href="/local-dashboard/view" 
              className="flex items-center justify-between bg-slate-700 hover:bg-slate-600 transition-colors p-4 rounded-lg"
            >
              <span className="flex items-center">
                <Files className="mr-3 text-emerald-400" size={20} />
                <span className="text-white">View Files</span>
              </span>
              <ArrowRight size={18} className="text-slate-400" />
            </a>
            
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 transition-colors py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center">
              <span>Connect to Cloud Storage</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">File Upload</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">document.pdf</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">10 mins ago</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Complete</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Verification</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">image.jpg</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">2 hours ago</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Verified</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">Cloud Sync</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">backup.zip</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">Yesterday</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Syncing</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LocalStoragePage;