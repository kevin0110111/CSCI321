import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './registerAccount.css';
import calendar from '../assets/calendar.svg';

export default function RegisterAccount() {
  const navigate = useNavigate();

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    region: '',
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
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [day, month, year] = formData.dob.split('/').map(Number);
    const formattedDob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      avatar_url: null,
      region: formData.region,
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
      // Step 1: Create Account with Profile
      const registerResponse = await fetch('http://localhost:8000/api/accounts/with-profile', { // Adjust URL as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const registeredAccountData = await registerResponse.json();

      if (registerResponse.ok) {
        const accountId = registeredAccountData.account_id;
        const roleIdToAssign = 2; // Auto-set role_id to 2

        // Step 2: Assign Role to the newly created account
        const assignRoleResponse = await fetch(`http://localhost:8000/api/accounts/${accountId}/assign-role/${roleIdToAssign}`, { // Adjust URL as needed
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (assignRoleResponse.ok) {
          alert('Registration successful and role assigned!');
          navigate('/login'); // Redirect to login page on success
        } else {
          const assignRoleErrorData = await assignRoleResponse.json();
          alert(`Registration successful, but failed to assign role: ${assignRoleErrorData.detail || 'Something went wrong.'}`);
          // You might still want to navigate to login even if role assignment fails,
          // or handle this error more gracefully based on your application's needs.
          navigate('/login');
        }
      } else {
        alert(`Registration failed: ${registeredAccountData.detail || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  const updateDOB = (e, type) => {
    const value = e.target.value;
    const [day, month, year] = formData.dob.split('/').map(Number);
    let newDay = day || '';
    let newMonth = month || '';
    let newYear = year || '';

    if (type === 'day') newDay = value;
    if (type === 'month') newMonth = value;
    if (type === 'year') newYear = value;
    
    const updated = `${newDay || ''}/${newMonth || ''}/${newYear || ''}`;
    setFormData(prev => ({ ...prev, dob: updated }));

    if (newDay && newMonth && newYear) {
        setShowDOBPicker(false);
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
                type="text"
                name="region"
                placeholder="Region"
                className="register-input"
                value={formData.region}
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
              <div className="dob-block">
                <div className="dob-input-wrapper">
                  <input
                    type="text"
                    name="dob"
                    placeholder="Date of Birth (DD/MM/YYYY)"
                    className="register-input dob-input"
                    value={formData.dob}
                    onChange={handleChange}
                    readOnly
                  />
                  <img
                    src={calendar}
                    alt="Calendar"
                    className="calendar-icon"
                    onClick={() => setShowDOBPicker(prev => !prev)}
                  />
                </div>

                {showDOBPicker && (
                  <div className="dob-picker">
                    <select name="dob-day" onChange={e => updateDOB(e, 'day')} value={formData.dob.split('/')[0] || ''}>
                      <option value="">Day</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select name="dob-month" onChange={e => updateDOB(e, 'month')} value={formData.dob.split('/')[1] || ''}>
                      <option value="">Month</option>
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => (
                        <option key={i + 1} value={i + 1}>{month}</option>
                      ))}
                    </select>
                    <select name="dob-year" onChange={e => updateDOB(e, 'year')} value={formData.dob.split('/')[2] || ''}>
                      <option value="">Year</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
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
      </div>
    </div>
  );
}