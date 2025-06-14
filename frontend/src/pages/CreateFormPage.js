import React, { useState } from 'react';
import axios from 'axios';

const CreateFormPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([{ label: '', field_type: '' }]);

  const handleChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([...fields, { label: '', field_type: '' }]);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/forms',
        {
          title,
          description,
          fields,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('✅ Form created successfully!');
      setTitle('');
      setDescription('');
      setFields([{ label: '', field_type: '' }]);
    } catch (error) {
      console.error('Error creating form:', error.response?.data || error.message);
      alert('❌ Error creating form. Check console for details.');
    }
  };

  return (
    <div className="container">
      <h2>Create a New Form</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '10px', display: 'block' }}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: '20px', display: 'block' }}
      />
      {fields.map((field, idx) => (
        <div key={idx} style={{ marginBottom: '15px' }}>
          <input
            placeholder="Field Label"
            value={field.label}
            onChange={(e) => handleChange(idx, 'label', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <select
            value={field.field_type}
            onChange={(e) => handleChange(idx, 'field_type', e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
          </select>
        </div>
      ))}
      <button onClick={addField} style={{ marginRight: '10px' }}>Add Field</button>
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateFormPage;
