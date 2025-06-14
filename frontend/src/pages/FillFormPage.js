import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FillFormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/forms/${formId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm(res.data);
    };
    fetchForm();
  }, [formId]);

  const handleChange = (label, value) => {
    setResponses((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:8000/forms/${formId}/responses`, {
        answers: responses
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Response submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to submit response");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      {form.fields.map(field => (
        <div key={field.id}>
          <label>{field.label}</label><br />
          <input
            type={field.field_type === "number" ? "number" : "text"}
            onChange={(e) => handleChange(field.label, e.target.value)}
          /><br />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FillFormPage;
