import './updateAgentAccount.css';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function UpdateAgentAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    dob: '',
    email: '',
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

  const [currentAccountId, setCurrentAccountId] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState(null);

  useEffect(() => {
    const storedAccountId = localStorage.getItem('accountId');
    const storedAccountString = localStorage.getItem('account');

    if (storedAccountId) {
      setCurrentAccountId(parseInt(storedAccountId, 10));
    }

    if (storedAccountString) {
      try {
        const storedAccount = JSON.parse(storedAccountString);
        if (storedAccount && storedAccount.profile && storedAccount.profile.profile_id) {
          setCurrentProfileId(storedAccount.profile.profile_id);
        }
      } catch (error) {
        console.error('Failed to parse account data from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAccountAndProfile = async () => {
      if (!currentAccountId || !currentProfileId) {
        return;
      }

      try {
        const accountResponse = await fetch(`http://localhost:8000/api/accounts/${currentAccountId}`);
        const accountData = await accountResponse.json();

        const profileResponse = await fetch(`http://localhost:8000/api/profiles/${currentProfileId}`);
        const profileData = await profileResponse.json();

        if (accountResponse.ok && profileResponse.ok) {
          setFormData(prev => ({
            ...prev,
            username: accountData.username,
            email: accountData.email,
            name: profileData.name,
            dob: profileData.dob
                ? new Date(profileData.dob).toLocaleDateString('en-GB').split('/').join('-')
                : '',
          }));
        } else {
          console.error('Failed to fetch account or profile data.');
          alert('Failed to load account or profile data.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
      }
    };

    fetchAccountAndProfile();
  }, [currentAccountId, currentProfileId]);

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

  const handleSave = async () => {
    if (!currentAccountId || !currentProfileId) {
        alert('Account or Profile ID not available. Please log in again.');
        return;
    }

    // Handle password change separately if newPassword is provided
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        alert('Please enter your current password to change it.');
        return;
      }
      if (!passwordValidations.length || !passwordValidations.number || !passwordValidations.uppercase || !passwordValidations.specialChar || !passwordValidations.lowercase) {
        alert('New password does not meet all requirements.');
        return;
      }

      try {
        const passwordChangePayload = {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        };

        const passwordResponse = await fetch(`http://localhost:8000/api/accounts/${currentAccountId}/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(passwordChangePayload),
        });

        const passwordData = await passwordResponse.json();

        if (!passwordResponse.ok) {
          alert(`Failed to change password: ${passwordData.detail || 'Something went wrong.'}`);
          return; // Stop if password change failed
        } else {
            alert('Password changed successfully!');
            // Clear password fields after successful change
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        }

      } catch (error) {
        console.error('Error changing password:', error);
        alert('An error occurred during password change. Please try again.');
        return; // Stop if there's an error
      }
    }

    // Prepare account update payload (username and email)
    const accountUpdatePayload = {
      username: formData.username,
      email: formData.email,
    };

    // Prepare profile update payload (name and DOB)
    const [day, month, year] = formData.dob.split('-').map(Number);
    const formattedDob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const profileUpdatePayload = {
      name: formData.name,
      dob: formattedDob,
    };

    try {
      // Update Account
      const accountResponse = await fetch(`http://localhost:8000/api/accounts/${currentAccountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountUpdatePayload),
      });

      // Update Profile
      const profileResponse = await fetch(`http://localhost:8000/api/profiles/${currentProfileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileUpdatePayload),
      });

      if (accountResponse.ok && profileResponse.ok) {
        alert('Account and Profile updated successfully!');
        setIsEditing(false);
      } else {
        const accountError = await accountResponse.json();
        const profileError = await profileResponse.json();
        alert(`Failed to update: Account - ${accountError.detail || 'Error'}, Profile - ${profileError.detail || 'Error'}`);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      alert('An error occurred during update. Please try again.');
    }
  };

  const AgentLogout = () => {
    localStorage.clear();
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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                readOnly={!isEditing}
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
                placeholder="DD-MM-YYYY"
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