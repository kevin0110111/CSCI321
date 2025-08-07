import React, { useState, useEffect } from 'react';
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import './AdminCreateAccount.css';

export default function AdminCreateAccount() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [job, setJob] = useState('');
  const [institution, setInstitution] = useState('');
  const [reason, setReason] = useState('');
  const [role, setRole] = useState('');
  const [dob, setDob] = useState(new Date().toISOString().split('T')[0]);
  const [responseBox, setResponseBox] = useState({ show: false, message: '' });

  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    passwordsMatch: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const patterns = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  useEffect(() => {
    setValidation({
      length: password.length >= 8,
      uppercase: patterns.uppercase.test(password),
      lowercase: patterns.lowercase.test(password),
      number: patterns.number.test(password),
      specialChar: patterns.specialChar.test(password),
      passwordsMatch: password === confirmPassword && password !== "",
    });
  }, [password, confirmPassword]);

  const isValidPassword = Object.values(validation).every(Boolean);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid email address, e.g. user@gmail.com');
    } else {
      setEmailError('');
    }
  };

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address, e.g. user@gmail.com');
      return;
    }

    if (!isValidPassword) {
      setResponseBox({ show: true, message: "Please fix the password requirements before submitting." });
      return;
    }

    const payload = {
      username: username,
      email: email,
      password: password,
      avatar_url: null,
      country: country,
      city: city,
      is_premium: false,
      subscription_expiry: null,
      name: fullName,
      dob: dob,
      job: job,
      institution: institution,
      reason_foruse: reason,
      profile_preferred_language: "en"
    };

    try {
      const registerResponse = await fetch('http://localhost:8000/api/accounts/with-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const registeredAccountData = await registerResponse.json();

      if (registerResponse.ok) {
        const accountId = registeredAccountData.account_id;
        let roleIdToAssign = null;

        if (role === 'User') roleIdToAssign = 2;
        else if (role === 'Agent') roleIdToAssign = 3;
        else if (role === 'Admin') roleIdToAssign = 1;

        if (roleIdToAssign) {
          const assignRoleResponse = await fetch(`http://localhost:8000/api/accounts/${accountId}/assign-role/${roleIdToAssign}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });

          if (assignRoleResponse.ok) {
            setResponseBox({ show: true, message: 'Account created and role assigned successfully!' });
          } else {
            const error = await assignRoleResponse.json();
            setResponseBox({ show: true, message: `Account created, but failed to assign role: ${error.detail || 'Unknown error'}` });
          }
        } else {
          setResponseBox({ show: true, message: 'Account created. No role assignment was made (role was not "User" or "Agent").' });
        }
      } else {
        setResponseBox({ show: true, message: `Account creation failed: ${registeredAccountData.detail || 'Unknown error'}` });
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setResponseBox({ show: true, message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-create-container">
          <h2 className="admin-section-title">Create a new account for user</h2>
          <hr className="admin-section-divider" />
          <form className="admin-create-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input type="text" placeholder="e.g. Jane Doe" required className='admin-form-select' value={fullName} onChange={e => setFullName(e.target.value)} />
            </label>
            <label>
              Username
              <input type="text" placeholder="e.g. JaneDoe123" required className='admin-form-select' value={username} onChange={e => setUsername(e.target.value)} />
            </label>
            <label>
              Email address
              <input
                type="text"
                placeholder="e.g. user@gmail.com"
                value={email}
                onChange={handleEmailChange}
                required
                className="admin-form-select"
              />
              {emailError && (
                <div style={{ color: 'red', marginTop: '5px' }}>{emailError}</div>
              )}
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='admin-form-select'
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className='admin-form-select'
              />
            </label>
            <ul className="password-checklist">
              <li style={{ color: validation.length ? "green" : "red" }}>
                {validation.length ? "✓" : "✗"} At least 8 characters
              </li>
              <li style={{ color: validation.uppercase ? "green" : "red" }}>
                {validation.uppercase ? "✓" : "✗"} One uppercase letter
              </li>
              <li style={{ color: validation.lowercase ? "green" : "red" }}>
                {validation.lowercase ? "✓" : "✗"} One lowercase letter
              </li>
              <li style={{ color: validation.number ? "green" : "red" }}>
                {validation.number ? "✓" : "✗"} One number
              </li>
              <li style={{ color: validation.specialChar ? "green" : "red" }}>
                {validation.specialChar ? "✓" : "✗"} One special character
              </li>
              <li style={{ color: validation.passwordsMatch ? "green" : "red" }}>
                {validation.passwordsMatch ? "✓" : "✗"} Passwords match
              </li>
            </ul>
            <hr className="admin-section-divider" />
            <label>
              Country
              <input type="text" required className='admin-form-select' value={country} onChange={e => setCountry(e.target.value)} />
            </label>
            <label>
              City
              <input type="text" required className='admin-form-select' value={city} onChange={e => setCity(e.target.value)} />
            </label>
            <label>
              Job
              <input type="text" required className='admin-form-select' value={job} onChange={e => setJob(e.target.value)} />
            </label>
            <label>
              Institution
              <input type="text" required className='admin-form-select' value={institution} onChange={e => setInstitution(e.target.value)} />
            </label>
            <label>
              Reason for use
              <input type="text" required className='admin-form-select' value={reason} onChange={e => setReason(e.target.value)} />
            </label>
            <label>
              Role
              <select defaultValue="" required className="admin-form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="" disabled>
                  --
                </option>
                <option>Agent</option>
                <option>User</option>
                <option>Admin</option>
              </select>
            </label>
            <label>
              Date of birth
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="admin-form-input"
              />
            </label>
            <hr className="admin-section-divider" />
            <button type="submit" className="admin-save-button">
              Create
            </button>
          </form>
        </main>
      </div>

      {responseBox.show && (
        <div className="adCreateAcc-confirmation-overlay">
          <div className="adCreateAcc-confirmation-box">
            <p>{responseBox.message}</p>
            <button onClick={closeResponseBox} className="adCreateAcc-yes-button">Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}