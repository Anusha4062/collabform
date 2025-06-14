import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8000/auth/register', {
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
    <div className="auth-container">
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage; 