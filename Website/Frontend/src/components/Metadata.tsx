import React, { useState, useEffect } from 'react';
import { Send, HardDrive } from 'lucide-react';

interface FileItem {
  _id: string;
  name: string;
}

interface StorageItem {
  _id: string;
  hostname: string;
  ipAddress: string;
  username: string;
  password: string;
  role: string;
}

const Metadata = () => {
  const [cloudFiles, setCloudFiles] = useState<FileItem[]>([]);
  const [localStorages, setLocalStorages] = useState<StorageItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/files');
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        setCloudFiles(data);
      } catch (error) {
        setStatus('Error fetching files');
      }
    };

    const fetchStorages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users?role=local');
        if (!response.ok) throw new Error('Failed to fetch storages');
        const data = await response.json();
        setLocalStorages(data);
      } catch (error) {
        setStatus('Error fetching storages');
      }
    };

    fetchFiles();
    fetchStorages();
  }, []);

  const handleRunScript = async () => {
    if (!selectedFile) {
      setStatus('Please select a file');
      return;
    }
    const selected = cloudFiles.find((file) => file._id === selectedFile);
    if (!selected) {
      setStatus('Selected file not found');
      return;
    }
    setIsSending(true);
    setStatus('Running script...');
    try {
      const response = await fetch('http://localhost:5000/api/script/run-taggen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: selected.name }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus('Metadata generated successfully!');
      } else {
        setStatus('Error running script: ' + data.message);
      }
    } catch (err) {
      setStatus('Error running script');
    }
    setIsSending(false);
  };

  const handleSendFile = async () => {
    if (!selectedFile || !selectedStorage) {
      setStatus('Please select both file and storage location');
      return;
    }
    const selectedFileObj = cloudFiles.find((file) => file._id === selectedFile);
    const selectedStorageObj = localStorages.find((storage) => storage._id === selectedStorage);
    if (!selectedFileObj || !selectedStorageObj) {
      setStatus('Selected file or storage not found');
      return;
    }
    setIsSending(true);
    setStatus('Sending file via SCP...');
    try {
      const response = await fetch('http://localhost:5000/api/script/send-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFileObj.name,
          ipAddress: selectedStorageObj.ipAddress,
          username: selectedStorageObj.hostname,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus('File sent successfully!');
      } else {
        setStatus('Error sending file: ' + data.message);
      }
    } catch (err) {
      setStatus('Error sending file');
    }
    setIsSending(false);
  };

  // Only show send-file section if script ran successfully
  const canSendFile = status === 'Metadata generated successfully!';

  return (
    <main className="flex-1 p-6 md:p-12 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8 md:p-12 -mt-20">
        <div className="flex items-center space-x-3 mb-10">
          <Send className="w-10 h-10 text-emerald-400 drop-shadow" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Send Files to Local Storage
          </h1>
        </div>

        <div className="w-full max-w-xl bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-700">
          {/* Select File */}
          <div className="mb-8">
            <label className="block text-base font-semibold text-slate-300 mb-3">
              Select File from Cloud
            </label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-emerald-400 transition"
            >
              <option value="">Choose a file</option>
              {cloudFiles.map((file) => (
                <option key={file._id} value={file._id}>
                  {file.name}
                </option>
              ))}
            </select>
          </div>

          {/* Run Script Button */}
          <button
            onClick={handleRunScript}
            disabled={isSending}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors shadow ${
              isSending
                ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
            }`}
          >
            {isSending ? 'Running script...' : 'Run Script'}
          </button>

          {/* Only show after script run */}
          {canSendFile && (
            <div className="mt-12 border-t border-slate-700 pt-8 animate-fade-in">
              <h2 className="text-white text-xl font-bold mb-6 flex items-center">
              <HardDrive className="w-6 h-6 text-emerald-500 mr-2" />
                Send File to Remote Local Storage
              </h2>
              {/* Select Remote Storage */}
              <div className="mb-6">
                <label className="block text-base font-semibold text-slate-300 mb-3">
                  Select Remote Storage
                </label>
                <div className="space-y-3">
                  {localStorages.map((storage) => (
                    <div
                      key={storage._id}
                      className={`flex items-center p-4 border-2 rounded-lg transition cursor-pointer ${
                        selectedStorage === storage._id
                          ? 'border-emerald-400 bg-slate-800 shadow-lg'
                          : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                      }`}
                      onClick={() => setSelectedStorage(storage._id)}
                    >
                      <HardDrive className="w-5 h-5 text-emerald-400 mr-3" />
                      <div>
                        <p className="text-white font-semibold">{storage.hostname}</p>
                        <p className="text-slate-400 text-sm">IP: {storage.ipAddress}</p>
                        <p className="text-slate-400 text-sm">User: {storage.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <form
                id="sendFileForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendFile();
                }}
              >
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg py-3 px-4 text-white mb-5 focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-lg shadow transition"
                >
                  {isSending ? 'Sending...' : 'Send File'}
                </button>
              </form>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div
              className={`mt-8 p-4 rounded-lg text-center text-lg font-semibold transition ${
                status.toLowerCase().includes('error') || status.includes('Please')
                  ? 'bg-red-500/10 text-red-400 border border-red-400'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-400'
              }`}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Metadata;
