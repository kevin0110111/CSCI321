import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './registerAccount.css';
import calendar from '../assets/calendar.svg';

export default function RegisterAccount() {
  const navigate = useNavigate();
  const [responseBox, setResponseBox] = useState({ show: false, message: '' });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    city: '',
    password: '',
    confirmPassword: '',
    name: '',
    dob: '', // This will be formatted to YYYY-MM-DD for backend
    job: '',
    institution: '',
    reason: ''
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

  const handleNext = (e) => {
    e.preventDefault();
    const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

    if (!allRequirementsMet) {
      setResponseBox({ show: true, message: 'Password does not meet the requirements. Please enter a proper password.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setResponseBox({ show: true, message: 'Passwords do not match!' });
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDob = formData.dob;

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      avatar_url: null,
      country: formData.country,
      city: formData.city,
      is_premium: false,
      subscription_expiry: null,
      name: formData.name,
      dob: formattedDob,
      job: formData.job,
      institution: formData.institution,
      reason_foruse: formData.reason,
      profile_preferred_language: "en"
    };

    try {
      const registerResponse = await fetch('https://fyp-backend-a0i8.onrender.com/api/accounts/with-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const registeredAccountData = await registerResponse.json();

      if (registerResponse.ok) {
        const accountId = registeredAccountData.account_id;
        const roleIdToAssign = 2;

        const assignRoleResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${accountId}/assign-role/${roleIdToAssign}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (assignRoleResponse.ok) {
          setResponseBox({ show: true, message: 'Registration successful and role assigned!' });
        } else {
          const assignRoleErrorData = await assignRoleResponse.json();
          setResponseBox({ show: true, message: `Registration successful, but failed to assign role: ${assignRoleErrorData.detail || 'Something went wrong.'}` });
          navigate('/login');
        }
      } else {
        setResponseBox({ show: true, message: `Registration failed: ${registeredAccountData.detail || 'Something went wrong.'}` });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setResponseBox({ show: true, message: 'An error occurred during registration. Please try again.' });
    }
  };

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
    if (responseBox.message === 'Registration successful and role assigned!') {
      navigate('/login');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Register Account</h1>
        <form onSubmit={step === 1 ? handleNext : handleSubmit}>
          {step === 1 && (
            <>
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
                type="email"
                name="email"
                placeholder="Email"
                className="register-input"
                value={formData.email}
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
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="register-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="password-requirements">
                <div className={`requirement ${passwordRequirements.length ? 'met' : 'unmet'}`}>• At least 8 characters</div>
                <div className={`requirement ${passwordRequirements.number ? 'met' : 'unmet'}`}>• One number</div>
                <div className={`requirement ${passwordRequirements.uppercase ? 'met' : 'unmet'}`}>• One uppercase letter</div>
                <div className={`requirement ${passwordRequirements.lowercase ? 'met' : 'unmet'}`}>• One lowercase letter</div>
                <div className={`requirement ${passwordRequirements.special ? 'met' : 'unmet'}`}>• One special character</div>
              </div>
              <button type="submit" className="register-btn">Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="register-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="register-input"
                required
              />
              <input
                type="text"
                name="job"
                placeholder="Job"
                className="register-input"
                value={formData.job}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="register-input"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="register-input"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="institution"
                placeholder="Institution"
                className="register-input"
                value={formData.institution}
                onChange={handleChange}
                required
              />
              <textarea
                name="reason"
                placeholder="Why are you registering?"
                className="register-input"
                value={formData.reason}
                onChange={handleChange}
                required
              />
              <button type="submit" className="register-btn">Register</button>
            </>
          )}
        </form>

        <div className="login-link">
          Have an account? <Link to="/login">Sign in</Link>
        </div>

        {responseBox.show && (
          <div className="regAcc-confirmation-overlay">
            <div className="regAcc-confirmation-box">
              <p>{responseBox.message}</p>
              <button onClick={closeResponseBox} className="regAcc-yes-button">Ok</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}