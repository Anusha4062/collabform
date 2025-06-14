import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FormListPage = () => {
  const [forms, setForms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Please login first.");
          return;
        }

        const res = await axios.get('http://localhost:8000/forms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForms(res.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
        alert("Failed to fetch forms.");
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Please login first.");
          return;
        }

        const res = await axios.get('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        alert("Failed to fetch user information.");
      }
    };

    fetchForms();
    fetchUser();
  }, []);

  return (
    <div className="container">
      <h2>Available Forms</h2>

      <Link to="/forms/create">
        <button>Create New Form</button>
      </Link>

      {forms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        forms.map((form) => (
          <div
            key={form.id}
            style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}
          >
            <h3>{form.title}</h3>
            <p>{form.description}</p>

            <Link to={`/forms/${form.id}/fill`}>
              <button>Fill</button>
            </Link>

            {currentUser && form.creator_id && currentUser.id === form.creator_id && (
              <Link to={`/forms/${form.id}/responses`}>
                <button>View Responses</button>
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FormListPage;
