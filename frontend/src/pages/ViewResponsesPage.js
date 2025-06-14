import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewResponsesPage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/forms/${formId}/responses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponses(res.data);
    };

    fetchResponses();
  }, [formId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Responses for Form ID: {formId}</h2>
      {responses.map((response, index) => (
        <div key={response.id} className="mb-4 p-4 border rounded-md bg-white shadow-sm">
          <h3 className="font-semibold">Response #{index + 1}</h3>
          <p><strong>Responder:</strong> {response.responder.username}</p>
          <ul className="mt-2 list-disc list-inside">
            {response.answers.map((ans, i) => (
              <li key={i}><strong>Q{ans.question_id}:</strong> {ans.answer_text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ViewResponsesPage;
