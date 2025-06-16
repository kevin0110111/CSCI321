import React, { useState } from 'react';
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
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="logo">
          <span className="logo-icon">🌽</span>
          Logo
        </div>

        <div className="top-center">
          <a href="#">Account</a>
          <span className="divider">|</span>
          <a href="#">Profile</a>
        </div>

        <div className="icons">
          <span>🔔</span>
          <span>📂</span>
          <span>👤</span>
        </div>
      </header>

      {/* Layout container */}
      <div className="layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <ul>
            <li><a href="#"><span>📝</span> Create</a></li>
            <li><a href="#"><span>🔔</span> Notifications</a></li>
            <li><a href="#"><span>👁️</span> View</a></li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="admin-create-container">
          <h2 className="section-title">Create a new account for a user</h2>

          <form className="admin-create-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input type="text" placeholder="e.g. Jane Doe" required />
            </label>

            <label>
              Email address
              <input
                type="text"
                placeholder="e.g. user@example.com"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <div style={{ color: 'red', marginTop: '5px' }}>{emailError}</div>}
            </label>

            <label>
              Role
              <select defaultValue="" required>
                <option value="" disabled>--</option>
                <option>Agent</option>
                <option>User</option>
                <option>Premium User</option>
              </select>
            </label>

            <hr className="section-divider" />

            <h3 className="section-title">Languages and dates</h3>

            <div className="language-section">
              <div className="row">
                <div className="label">Language</div>
                <div className="value">English</div>
              </div>

              <div className="row">
                <div className="label">Date format</div>
                <div className="value">DD-MM-YYYY</div>
              </div>

              <div className="row">
                <div className="label">Automatic timezone</div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <button type="submit">Save</button>
          </form>
        </main>
      </div>
    </div>
  );
}
