import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResponses = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (role !== 'admin') {
        alert("You are not authorized to view this page.");
        navigate('/forms');
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/forms/all-responses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResponses(res.data);
      } catch (error) {
        console.error('Error fetching responses:', error);
      }
    };

    fetchResponses();
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Panel - All Form Responses</h1>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <div className="space-y-4">
          {responses.map((resp, idx) => (
            <div key={idx} className="p-4 bg-white shadow rounded border">
              <p><strong>Form ID:</strong> {resp.form_id}</p>
              <p><strong>Submitted By:</strong> {resp.user_id}</p>
              <pre className="bg-gray-100 p-2 mt-2 rounded">
                {JSON.stringify(resp.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
