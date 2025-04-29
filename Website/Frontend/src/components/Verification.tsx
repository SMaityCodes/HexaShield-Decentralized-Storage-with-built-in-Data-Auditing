import React, { useState, useEffect } from 'react';
import { Shield, Send, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

interface Auditor {
  _id: string;
  hostname: string;
  ipAddress: string;
  role: string;
}

const socket = io('http://172.29.2.207:5000');
const aliceSocket = io('http://172.29.2.207:5000/alice-output');

const Verification = () => {
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [auditees, setAuditees] = useState<Auditor[]>([]);
  const [selectedAuditee, setSelectedAuditee] = useState('');
  const [auditeePassword, setAuditeePassword] = useState('');
  const [receivedMessages, setReceivedMessages] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAuditor, setSelectedAuditor] = useState('');
  const [auditorPassword, setAuditorPassword] = useState('');
  const [auditorSent, setAuditorSent] = useState(false);
  const [auditeeSent, setAuditeeSent] = useState(false);
  const [sendingToAuditor, setSendingToAuditor] = useState(false);
  const [sendingToAuditee, setSendingToAuditee] = useState(false);
  const [showMessagesBox, setShowMessagesBox] = useState(false);

  useEffect(() => {
    const fetchAuditorsAndAuditees = async () => {
      try {
        const [auditorsRes, auditeesRes] = await Promise.all([
          fetch('http://localhost:5000/api/users?role=local'),
          fetch('http://localhost:5000/api/users?role=local')
        ]);
        if (!auditorsRes.ok || !auditeesRes.ok) throw new Error('Failed to fetch users');
        const auditorsData = await auditorsRes.json();
        const auditeesData = await auditeesRes.json();
        setAuditors(auditorsData);
        setAuditees(auditeesData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAuditorsAndAuditees();
  }, []);

  const handleSendToAuditor = async () => {
    const selected = auditors.find(a => a._id === selectedAuditor);
    if (!selected || !auditorPassword) {
      alert('Please select an auditor and enter password');
      return;
    }
    setSendingToAuditor(true); // <-- ADD THIS
    try {
      const response = await fetch('http://localhost:5000/api/script/send-to-auditor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipAddress: selected.ipAddress,
          username: selected.hostname,
          password: auditorPassword
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Files sent to Auditor successfully!');
        setAuditorSent(true); // <-- Update auditorSent state
      } else {
        alert(`Failed to send files: ${result.message}`);
        setAuditorSent(false); // <-- Update to false on failure
      }
    } catch (error) {
      console.error('Error sending to auditor:', error);
      alert('Something went wrong!');
      setAuditorSent(false); // <-- Update to false if error occurs
    }
    finally {
      setSendingToAuditor(false); 
    }
  };

  const handleSendToAuditee = async () => {
    const selected = auditees.find(a => a._id === selectedAuditee);
    if (!selected || !auditeePassword) {
      alert('Please select an auditee and enter password');
      return;
    }
    setSendingToAuditee(true); // <-- ADD THIS
    try {
      const response = await fetch('http://localhost:5000/api/script/send-to-auditee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipAddress: selected.ipAddress,
          username: selected.hostname,
          password: auditeePassword
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert('Files sent to Auditee successfully!');
        setAuditeeSent(true); // <-- Update auditeeSent state
      } else {
        alert(`Failed to send file: ${result.message}`);
        setAuditeeSent(false); // <-- Update to false on failure
      }
    } catch (error) {
      console.error('Error sending file:', error);
      alert('Something went wrong while sending to auditee!');
      setAuditeeSent(false); // <-- Update to false if error occurs
    }finally {
      setSendingToAuditee(false); 
    }
  };

  const handleSendVerificationMsg = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/start-verification', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        setShowMessagesBox(true); // <-- Keep messages visible
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (error) {
      console.error('Error starting verification:', error);
      alert('Error starting verification');
    }
  };

  useEffect(() => {
    socket.on('alice-output', (data) => {
      console.log('Received Alice output:', data.message);
      setReceivedMessages(prev => prev + '\n' + data.message);
    });
    return () => {
      socket.off('alice-output');
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto relative bg-slate-900 rounded-xl shadow-lg mt-10">
      <div className="flex items-center space-x-4 mb-10">
        <Shield className="w-10 h-10 text-emerald-400" />
        <h1 className="text-3xl font-bold text-white">Verification Setup</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-xl text-white font-semibold mb-4">Auditor Details</h2>
          <select
            value={selectedAuditor}
            onChange={(e) => setSelectedAuditor(e.target.value)}
            className="w-full mb-3 bg-slate-700 text-white px-4 py-2 rounded-md border border-slate-600"
          >
            <option value="">Choose an auditor</option>
            {auditors.map((auditor) => (
              <option key={auditor._id} value={auditor._id}>
                {auditor.hostname} ({auditor.ipAddress})
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Auditor Password"
            value={auditorPassword}
            onChange={(e) => setAuditorPassword(e.target.value)}
            className="w-full mb-4 bg-slate-700 text-white px-4 py-2 rounded-md border border-slate-600"
          />
          <button
  onClick={handleSendToAuditor}
  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2"
>
  <Send className="w-4 h-4" />
  <span>Send to Auditor</span>
</button>
<br></br>
          {sendingToAuditor && (
  <div className="mt-2 text-emerald-500 text-sm font-medium">
    Sending to Auditor...
  </div>
)}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-md">
          <h2 className="text-xl text-white font-semibold mb-4">Auditee Details</h2>
          <select
            value={selectedAuditee}
            onChange={(e) => setSelectedAuditee(e.target.value)}
            className="w-full mb-3 bg-slate-700 text-white px-4 py-2 rounded-md border border-slate-600"
          >
            <option value="">Choose an auditee</option>
            {auditees.map((auditee) => (
              <option key={auditee._id} value={auditee._id}>
                {auditee.hostname} ({auditee.ipAddress})
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Auditee Password"
            value={auditeePassword}
            onChange={(e) => setAuditeePassword(e.target.value)}
            className="w-full mb-4 bg-slate-700 text-white px-4 py-2 rounded-md border border-slate-600"
          />
          <button
            onClick={handleSendToAuditee}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md font-semibold flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send to Auditee</span>
          </button>
          <br></br>
          {sendingToAuditee && (
  <div className="text-emerald-400 text-sm font-medium mt-2">Sending to Auditee...</div>
)}

        </div>
      </div>

      {auditorSent && auditeeSent && (
        <div className="bg-slate-800 rounded-xl p-6 shadow-md mt-8">
          <button
            onClick={handleSendVerificationMsg}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-md font-semibold"
          >
            Send Verification Msgs
          </button>
        </div>
      )}

      {showSuccess && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3 transition-all animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <p>Your msgs have been sent to Alice and Bob. Please wait for their response.</p>
        </div>
      )}

{showMessagesBox && (
  <div className="mt-6">
    <h2 className="text-lg text-white font-semibold mb-2">Result from Auditor will be displayed here:</h2>
    <textarea
      value={receivedMessages}
      readOnly
      className="w-full bg-slate-700 text-white px-4 py-2 rounded-md border border-slate-600 resize-none"
      rows={8}
    />
  </div>
)}

    </div>
  );
};

export default Verification;
