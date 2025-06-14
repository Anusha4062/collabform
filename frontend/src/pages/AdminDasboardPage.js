import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get("http://localhost:8000/forms", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForms(res.data);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - All Forms</h1>
      <div className="grid grid-cols-1 gap-4">
        {forms.map((form) => (
          <div key={form.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">{form.title}</h2>
            <p className="text-sm text-gray-600">{form.description}</p>
            <button
              onClick={() => navigate(`/forms/${form.id}/responses`)}
              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              View Responses
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
