import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    domain_id: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registered successfully!', {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  setTimeout(() => navigate('/login'), 3000);
      } else {
        alert(data.message || 'Registration failed');
      }

    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div>
          <h1>Join Us!</h1>
          
        </div>
      </div>

      <div className="register-right">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Sign up and start learning!</h2>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <select
          className="form-input"
    name="domain_id"
    value={formData.domain_id}
    onChange={handleChange}
    required
  >
  <option value=""> Select a domain: </option>
  <option value="1">Medicine</option>
  <option value="2">Egineering</option>
  <option value="3">Finance & Accounting</option>
  <option value="4">Construction & Architecture</option>
</select>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <ToastContainer />

    </div>
  );
};

export default RegisterForm;
