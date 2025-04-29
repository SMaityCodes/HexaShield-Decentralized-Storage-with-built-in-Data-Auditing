// src/components/LocalViewFiles.tsx
import React, { useState, useEffect } from 'react';
import { Files, Download, FileText, FileImage, FileArchive, Filter, Search } from 'lucide-react';

type FileType = 'document' | 'image' | 'archive' | 'other';

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  lastModified: string;
  status: 'synced' | 'local' | 'pending';
}

function LocalViewFiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FileType | 'all'>('all');
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchLocalFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/local-storage');
        if (!response.ok) {
          throw new Error('Failed to fetch local files');
        }
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching local files:', error);
      }
    };

    fetchLocalFiles();
  }, []);

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'document':
        return <FileText className="text-blue-500" />;
      case 'image':
        return <FileImage className="text-purple-500" />;
      case 'archive':
        return <FileArchive className="text-yellow-500" />;
      default:
        return <Files className="text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Files className="mr-2 text-emerald-500" /> 
          View Files
        </h1>
        <p className="text-slate-400 mt-1">
          Browse and manage files stored on your local fog storage node
        </p>
      </header>

      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-slate-400" />
            <select
              className="bg-slate-700 border border-slate-600 rounded-lg text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FileType | 'all')}
            >
              <option value="all">All Files</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="archive">Archives</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Modified</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{file.name}</div>
                          <div className="text-sm text-slate-400">
                            {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{file.lastModified}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Files className="h-12 w-12 text-slate-500 mb-2" />
                      <p className="text-slate-400 text-sm">
                        {searchTerm ? "No files match your search" : "No files available"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LocalViewFiles;