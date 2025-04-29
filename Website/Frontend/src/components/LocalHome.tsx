import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function LocalHome() {
  const [scriptOutput, setScriptOutput] = useState<string[]>([]);
  const [cloudMessages, setCloudMessages] = useState<string[]>([]);
  const [localMessages, setLocalMessages] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newSocket = io('http://172.29.2.207:5000'); // 🔥 Cloud server IP
    setSocket(newSocket);
  
    newSocket.on('connect', () => {
      console.log('Connected to Cloud server:', newSocket.id);
      // Register role immediately after connecting
      newSocket.emit('register-role', { role: 'Alice' }); // Change 'Alice' to 'Bob' on Bob's client
    });
  
    // Handle the start-verification event from the cloud
    newSocket.on('start-verification', (data) => {
      console.log('Received Verification Start:', data.message);
      setCloudMessages(prev => [...prev, data.message]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    });
  
    newSocket.on('ready-for-challenge', (data) => {
      console.log('Received ready-for-challenge:', data.message);
      setLocalMessages(prev => [...prev, data.message]);
    });
  
    newSocket.on('disconnect', () => {
      console.log('Disconnected from Cloud server');
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  



  const handleSendChallengeReady = () => {
    if (socket) {
      socket.emit('ready-for-challenge', { message: 'Ready for challenge!' }); // 🚀 Send ready-for-challenge message
      console.log('Sent: Ready for challenge');
    }
  };

  const startAlice = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/script/run-alice', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to start Alice: ${response.statusText}`);
      }
      console.log('Alice started');
    } catch (error: any) {
      console.error('Error starting Alice:', error.message);
    }
  };

  const stopAlice = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/script/stop-alice', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to stop Alice: ${response.statusText}`);
      }
      console.log('Alice stopped');
    } catch (error: any) {
      console.error('Error stopping Alice:', error.message);
    }
  };

  const startBob = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/script/run-bob', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to start Bob: ${response.statusText}`);
      }
      console.log('Bob started');
    } catch (error: any) {
      console.error('Error starting Bob:', error.message);
    }
  };

  const stopBob = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/script/stop-bob', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to stop Bob: ${response.statusText}`);
      }
      console.log('Bob stopped');
    } catch (error: any) {
      console.error('Error stopping Bob:', error.message);
    }
  };
  return (
    <div className="min-h-screen w-full bg-slate-900 p-6 grid grid-cols-2 grid-rows-2 gap-6">
      {/* Top Left: Communicate with Cloud */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg flex flex-col">
        <h3 className="text-center text-lg font-bold mb-4">Communicate with Cloud</h3>
        <div className="flex-1 bg-slate-700 rounded-lg p-2 overflow-y-auto">
          {cloudMessages.length === 0 ? (
            <div className="text-slate-400 text-4xl font-bold text-center mt-6">No messages yet</div>
          ) : (
            cloudMessages.map((msg, idx) => (
              <div key={idx} className="text-3xl font-bold text-center mt-6">
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
  
      {/* Top Right: Communicate with Local Storage */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg flex flex-col">
        <h3 className="text-center text-lg font-bold mb-4">Communicate with Local Storage</h3>
        <div className="flex-1 bg-slate-700 rounded-lg p-2 overflow-y-auto">
          {localMessages.length === 0 ? (
            <div className="text-slate-400 text-4xl font-bold text-center mt-6">No challenge messages yet</div>
          ) : (
            localMessages.map((msg, idx) => (
              <div key={idx} className="text-3xl font-bold text-center mt-6">
                {msg}
              </div>
            ))
          )}
        </div>
        <button
          onClick={handleSendChallengeReady}
          className="mt-4 py-2 px-4 rounded-md font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Send Ready for Challenge
        </button>
      </div>
  
      {/* Bottom Left: Bob Controls */}
      {/* Bottom Left: Bob Controls */}
<div className="bg-slate-800 rounded-xl p-8 shadow-lg flex flex-col justify-center items-center gap-6">
  <h3 className="text-2xl font-bold mb-4">Bob Controls</h3>
  <button
    onClick={startBob}
    className="py-3 px-6 rounded-md font-semibold bg-emerald-500 hover:bg-emerald-600 text-white text-lg"
  >
    Start Bob
  </button>
  <button
    onClick={stopBob}
    className="py-3 px-6 rounded-md font-semibold bg-emerald-500 hover:bg-emerald-600 text-white text-lg"
  >
    Stop Bob
  </button>
</div>

{/* Bottom Right: Alice Controls */}
<div className="bg-slate-800 rounded-xl p-8 shadow-lg flex flex-col justify-center items-center gap-6">
  <h3 className="text-2xl font-bold mb-4">Alice Controls</h3>
  <button
    onClick={startAlice}
    className="py-3 px-6 rounded-md font-semibold bg-emerald-500 hover:bg-emerald-600 text-white text-lg"
  >
    Start Alice
  </button>
  <button
    onClick={stopAlice}
    className="py-3 px-6 rounded-md font-semibold bg-emerald-500 hover:bg-emerald-600 text-white text-lg"
  >
    Stop Alice
  </button>
</div>

    </div>
  );
  
  
}

export default LocalHome;