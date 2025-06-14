import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateFormPage from './pages/CreateFormPage';
import FillFormPage from './pages/FillFormPage';
import FormListPage from './pages/FormListPage';
import ViewResponsesPage from './pages/ViewResponsesPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, [location]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/forms" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forms" element={<FormListPage />} />
        <Route path="/forms/create" element={<CreateFormPage />} />
        <Route path="/forms/:formId/fill" element={<FillFormPage />} />
        <Route path="/forms/:formId/responses" element={<ViewResponsesPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
};

export default App;
