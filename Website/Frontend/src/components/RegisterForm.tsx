import React, { useState } from 'react';

interface RegisterFormProps {
  onRegistered: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistered }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    ipAddress: '',
    role: 'cloud',
    hostname: '',
  });

  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');  // State for toast message
  const [toastType, setToastType] = useState<'success' | 'error'>('success');  // Type of message (success or error)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setToastMessage('');  // Reset toast message before trying to register

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Registration failed');
      }

      setToastMessage('Registration successful!');  // Show success toast message
      setToastType('success');  // Set the toast type to success
      onRegistered();

      // Optionally, clear the toast after 5 seconds
      setTimeout(() => {
        setToastMessage('');
      }, 5000);
    } catch (err: any) {
      setToastMessage(err.message || 'Something went wrong!');  // Show error toast message
      setToastType('error');  // Set the toast type to error
      setTimeout(() => {
        setToastMessage('');
      }, 5000);
    }
  };

  return (
    <div className="relative">
      {/* Toast message */}
      {toastMessage && (
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-md text-white ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toastMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-16">
        <div>
          <label className="block text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">Hostname</label>
          <input
            type="text"
            name="hostname"
            placeholder="Enter your computer's hostname here"
            value={form.hostname}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">IP Address</label>
          <input
            type="text"
            name="ipAddress"
            placeholder="Enter your computer's IP address"
            value={form.ipAddress}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700 text-white"
            required
          >
            <option value="">Select Role</option>
            <option value="cloud">Cloud</option>
            <option value="local">Local</option>
          </select>
        </div>

        <div>
          <label className="block text-white mb-1">Enter your current PC password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
