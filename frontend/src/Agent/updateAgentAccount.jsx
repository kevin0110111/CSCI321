import './updateAgentAccount.css';
import model from '../assets/model.svg';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UpdateAgentAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: 'cx033',
    name: 'Cing Xiang',
    dob: '12-10-2025',
    email: 'cx033@gmail.com',
    currentPassword: '',
    newPassword: ''
  });
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
    lowercase: false
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      lowercase: /[a-z]/.test(password)
    });
  };

  const handleSave = () => {
    // Add save logic here
    setIsEditing(false);
  };

  const AgentLogout = () => {
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="agentsidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
            <Link to="/agentComment" className="nav-link"><img src={comment} alt="Comment" className="icon"/> Comment</Link>
            <Link to="/agentBugReport" className="nav-link"><img src={reportBug} alt="ReportedBug" className="icon"/> Reported Bug</Link>
            <Link to="/agentFAQ" className="nav-link"><img src={faq} alt="FAQ" className="icon"/> FAQ</Link>
          </div>
          <div className="logout-container">
            <button onClick={AgentLogout} className="nav-link agent-logout-button">
              <img src={logout} alt="Logout" className="icon"/> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        {/* Header */}
        <header className="header">
          <h1>Account Settings</h1>
          <div className="profile">
            <img src={profile} alt="Profile" className="profile-icon" />
          </div>
        </header>

        {/* Account Form */}
        <main className="account-form-container">
          <div className="account-form">
            <div className="form-field">
              <label>User name</label>
              <input 
                type="text" 
                value={formData.username} 
                readOnly 
              />
            </div>
            
            <div className="form-field">
              <label>Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="form-field">
              <label>Date of birth</label>
              <input 
                type="text" 
                name="dob"
                value={formData.dob} 
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="form-field">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="form-field">
              <label>Current password</label>
              <input 
                type="password" 
                name="currentPassword"
                value={formData.currentPassword} 
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="form-field">
              <label>New password</label>
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword} 
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
              <div className="password-requirements">
                <p className={passwordValidations.length ? 'valid' : 'invalid'}>• At least 8 characters</p>
                <p className={passwordValidations.number ? 'valid' : 'invalid'}>• One number</p>
                <p className={passwordValidations.uppercase ? 'valid' : 'invalid'}>• One uppercase letter</p>
                <p className={passwordValidations.specialChar ? 'valid' : 'invalid'}>• One special character</p>
                <p className={passwordValidations.lowercase ? 'valid' : 'invalid'}>• One lowercase letter</p>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="edit-btn" 
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                Edit
              </button>
              <button 
                className="save-btn" 
                onClick={handleSave}
                disabled={!isEditing}
              >
                Save
              </button>
              <button className="back-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
