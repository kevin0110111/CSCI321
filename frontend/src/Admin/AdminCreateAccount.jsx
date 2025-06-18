import React, { useState } from 'react';
import AdminTopBar from './AdminTopBar';   // <- update path as needed
import AdminSidebar from './AdminSidebar';
import './AdminCreateAccount.css';

export default function AdminCreateAccount() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Regex for email validation (simple but effective)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);

    if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid email address, e.g. user@example.com');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address, e.g. user@example.com');
      return;
    }
    setEmailError('');
    // Proceed with your form submission logic here
    alert('Form submitted successfully!');
  };

  return (
    <div className="admin-dashboard">
      {/* top bar */}
      <AdminTopBar />

      {/* main layout: sidebar + content */}
      <div className="admin-layout">
        <AdminSidebar />

        {/* Main Content */}
        <main className="admin-create-container">
          <h2 className="admin-section-title">Create a new account for user</h2>

          <form className="admin-create-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input type="text" placeholder="e.g. Jane Doe" required className='admin-form-select'/>
            </label>

            <label>
              Email address
              <input
                type="text"
                placeholder="e.g. user@example.com"
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
              Role
              <select defaultValue="" required className="admin-form-select">
                <option value="" disabled>
                  --
                </option>
                <option>Agent</option>
                <option>User</option>
                <option>Premium User</option>
              </select>
            </label>

            <hr className="admin-section-divider" />

            <h3 className="admin-section-title">Languages and dates</h3>

            <div className="admin-language-section">
              <div className="admin-row">
                <div className="admin-label">Language</div>
                <div className="admin-value">English</div>
              </div>

              <div className="admin-row">
                <div className="admin-label">Date</div>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="admin-form-input"
                />
              </div>

              <div className="admin-row">
                <div className="admin-label">Automatic timezone</div>
                <label className="admin-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="admin-slider round"></span>
                </label>
              </div>
            </div>

            <button type="submit" className="admin-save-button">
              Save
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
