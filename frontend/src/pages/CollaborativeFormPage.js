import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CollaborativeFormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/forms/${formId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched form:", res.data); 
        setForm(res.data);
      } catch (error) {
        console.error("Failed to fetch form", error);
      }
    };
  
    fetchForm();
  }, [formId, token]);
  
  const handleChange = (field, value) => {
    setResponses((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8000/forms/${formId}/responses`,
        { responses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit response", error);
    }
  };

  if (!form) return <div className="text-center mt-10 text-gray-600">Loading form...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-10">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {form.title || "Collaborative Form"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {form.fields?.map((field, index) => (
            <div key={index}>
              <label className="block text-gray-700 font-semibold mb-2">{field.label}</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={responses[field.label] || ""}
                onChange={(e) => handleChange(field.label, e.target.value)}
                placeholder={`Enter ${field.label}`}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Submit Response
          </button>
          {submitted && (
            <p className="text-green-600 text-center font-medium mt-4">Response submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CollaborativeFormPage;
