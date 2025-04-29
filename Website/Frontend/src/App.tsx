// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Shield, Server, HardDrive, FileCheck } from 'lucide-react';
import { User } from './types';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import LocalDashboard from './components/LocalDashboard';
import LocalHome from './components/LocalHome';
import Profile from './components/Profile';
import Home from './components/Home';
import UploadFile from './components/UploadFile';
import ViewFiles from './components/ViewFiles';
import Metadata from './components/Metadata';
import Verification from './components/Verification';
import VantaBackground from './components/VantaBackground';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Router>
      <VantaBackground
        effect="net"
        lineColor="#10b981"
        pointColor="#00FF00"
        backgroundColor="#121212"
      >
        <div className="min-h-screen">
          <Routes>
            {/* Profile Page */}
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile user={user} onLogout={() => setUser(null)} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Public Landing + Auth Route */}
            <Route
              path="/"
              element={
                !user ? (
                  <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center space-y-8">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-12 h-12 text-emerald-500" />
                        <h1 className="text-4xl font-bold text-white">Hexashield</h1>
                      </div>
                      <p className="text-white text-center max-w-2xl">
  Decentralized Data Integrity Guardian - Ensuring the security and authenticity 
  of your data through advanced homomorphic authentication and fog computing
</p>

                      {showRegister ? (
                        <>
                          <RegisterForm onRegistered={setUser} />
                          <p className="text-slate-400 mt-4">
                            Already have an account?{' '}
                            <button onClick={() => setShowRegister(false)} className="text-emerald-400 underline">
                              Login here
                            </button>
                          </p>
                        </>
                      ) : (
                        <>
                          <LoginForm onLogin={setUser} />
                          <p className="text-slate-400 mt-4">
                            Don't have an account?{' '}
                            <button onClick={() => setShowRegister(true)} className="text-emerald-400 underline">
                              Register here
                            </button>
                          </p>
                        </>
                      )}
                    </div>

                    <div className="mt-24">
                      <h2 className="text-2xl font-semibold text-white text-center mb-12">How It Works</h2>
                      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 backdrop-blur-sm">
                          <Server className="w-8 h-8 text-emerald-500 mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Cloud Storage & Authentication</h3>
                          <p className="text-slate-400">
                            Data files are stored securely in the cloud with metadata generation using 
                            homomorphic authenticators for enhanced security.
                          </p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 backdrop-blur-sm">
                          <HardDrive className="w-8 h-8 text-emerald-500 mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Fog Server Deployment</h3>
                          <p className="text-slate-400">
                            Files and metadata are strategically deployed to fog storage servers and 
                            auditors for optimal performance and security.
                          </p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 backdrop-blur-sm">
                          <FileCheck className="w-8 h-8 text-emerald-500 mb-4" />
                          <h3 className="text-lg font-medium text-white mb-2">Integrity Verification</h3>
                          <p className="text-slate-400">
                            Continuous monitoring through challenge-response verification ensures 
                            data integrity with instant alert systems.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : user.role === 'cloud' ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/local-dashboard" replace />
                )
              }
            />

            {/* Cloud Dashboard with Nested Routes */}
            <Route
              path="/dashboard"
              element={
                user?.role === 'cloud' ? (
                  <Dashboard user={user} onLogout={() => setUser(null)} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            >
              <Route index element={<Home />} />
              <Route path="upload" element={<UploadFile user={user} onLogout={() => setUser(null)} />} />
              <Route path="view" element={<ViewFiles />} />
              <Route path="metadata" element={<Metadata />} />
              <Route path="verify" element={<Verification />} />
              <Route path="profile" element={<Profile user={user} onLogout={() => setUser(null)} />} />
            </Route>

            {/* Local Storage Dashboard */}
            <Route
  path="/local-dashboard"
  element={
    user?.role === 'local' ? (
      <LocalDashboard user={user} onLogout={() => setUser(null)} />
    ) : (
      <Navigate to="/" replace />
    )
  }
>
  <Route index element={<LocalHome />} />
</Route>

          </Routes>
        </div>
      </VantaBackground>
    </Router>
  );
}

export default App;