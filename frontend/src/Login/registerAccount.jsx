import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './registerAccount.css';

export default function RegisterAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    dob: '',
    password: ''
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    uppercase: false,
    lowercase: false,
    special: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordRequirements(value);
    }
  };

  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration data:', formData);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Register Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="register-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="User name"
            className="register-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="dob"
            placeholder="Date of Birth (DD/MM/YYYY)"
            className="register-input"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <div className="password-requirements">
            <div className={`requirement ${passwordRequirements.length ? 'met' : 'unmet'}`}>
              • At least 8 characters
            </div>
            <div className={`requirement ${passwordRequirements.number ? 'met' : 'unmet'}`}>
              • One number
            </div>
            <div className={`requirement ${passwordRequirements.uppercase ? 'met' : 'unmet'}`}>
              • One uppercase letter
            </div>
            <div className={`requirement ${passwordRequirements.lowercase ? 'met' : 'unmet'}`}>
              • One lowercase letter
            </div>
            <div className={`requirement ${passwordRequirements.special ? 'met' : 'unmet'}`}>
              • One special character
            </div>
          </div>
          
          <button type="submit" className="register-btn">Register</button>
        </form>
        
        <div className="login-link">
          Have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
