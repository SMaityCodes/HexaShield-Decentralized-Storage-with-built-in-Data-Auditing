// src/components/Home.tsx
import React from 'react';

const Home = () => {
  return (
    <main className="flex-1 p-12">
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-800 rounded-xl border border-slate-700 p-16 mt-[-40px]">
        <p className="text-7xl font-extrabold mb-14 text-center" style={{ color: '#10b981' }}>
          Welcome to Cloud
        </p>

        <p className="text-3xl text-slate-200 mb-16 text-center">
          Check your file integrity, manage backups, and stay secure.
        </p>

        <div className="flex flex-wrap gap-14 justify-center items-center">
          <div className="w-72 h-72 bg-white/10 border border-slate-600 font-semibold rounded-full flex items-center justify-center text-center text-xl text-white p-8 shadow-xl">
            📁 Upload your files securely to the cloud
          </div>
          <div className="w-72 h-72 bg-white/10 border border-slate-600 font-semibold rounded-full flex items-center justify-center text-center text-xl text-white p-8 shadow-xl">
            🧾 Generate metadata and backup copies instantly
          </div>
          <div className="w-72 h-72 bg-white/10 border border-slate-600 font-semibold rounded-full flex items-center justify-center text-center text-xl text-white p-8 shadow-xl">
            ✅ Verify file integrity across cloud & local storage
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
