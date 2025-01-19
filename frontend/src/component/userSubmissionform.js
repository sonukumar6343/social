import React, { useState } from 'react';
import { useRef } from 'react';

const UserSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    socialMediaHandle: '',
    imageFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('socialMediaHandle', formData.socialMediaHandle);

    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append('imageFile', formData.images[i]);
      }
    }

    try {
      const response = await fetch('https://socialmedia-fbyd.onrender.com/socialMedia/createUser', {
        method: 'POST',
        body: data,
      });

      console.log('response:',response);

      const result = await response.json();
      console.log('result:',result);
      if (response.ok) {
        alert('Submission successful!');
         
         if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFormData({
          name: '',
          socialMediaHandle: '',
          imageFile: null,
        });

        
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit');
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f7f7f7' }}>
      <div style={{ width: '500px', padding: '20px', background: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Submission Form</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Social Media Handle:</label>
            <input
              type="text"
              name="socialMediaHandle"
              value={formData.socialMediaHandle}
              onChange={handleChange}
              placeholder="Enter handle"
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Upload Images:</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting} 
            style={{
              width: '100%',
              padding: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSubmissionForm;


