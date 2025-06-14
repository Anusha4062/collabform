import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <h3 className="logo" onClick={() => navigate('/')}>CollabForm</h3>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/forms">My Forms</Link>
            <Link to="/forms/create">Create Form</Link>
            {role === 'admin' && (
              <Link to="/admin">View All Responses</Link>
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
