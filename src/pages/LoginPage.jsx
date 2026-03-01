import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gender: 'Male',
    age: 'Age 18-22',
    marital: 'Single',
    support: 'Yes',
    living: 'Yes'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStart = () => {
    localStorage.setItem('userDemographics', JSON.stringify(formData));
    navigate('/assessment');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        <h1>Tell us about yourself</h1>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age Range</label>
            <select name="age" onChange={handleChange}>
              <option>Age 18-22</option>
              <option>Age 23-25</option>
              <option>Age 26-35</option>
              <option>Age 36-50</option>
              <option>Age 50-80</option>
            </select>
          </div>

          <div className="form-group">
            <label>Marital Status</label>
            <select name="marital" onChange={handleChange}>
              <option>Single</option>
              <option>Married</option>
              <option>In relationship</option>
            </select>
          </div>

          <div className="form-group">
            <label>Do you live with your family?</label>
            <select name="living" onChange={handleChange}>
              <option>Yes</option>
              <option>No</option>
              <option>Sometimes</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label>Do you have anyone to talk to?</label>
            <select name="support" onChange={handleChange}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <button className="cta-button" onClick={handleStart}>
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default LoginPage;