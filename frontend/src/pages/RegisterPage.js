import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/auth/register`, {
        email,
        username,
        password,
      });
      alert('Registration successful! You can now login.');
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(`Registration failed: ${error.response?.data?.detail || error.message}`);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Create a new account</h2>
        <div className="space-y-4">
          <input
            placeholder="Username"
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
