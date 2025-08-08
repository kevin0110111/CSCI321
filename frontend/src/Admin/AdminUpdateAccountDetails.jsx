import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminUpdateAccountDetails.css";

export default function UpdateAccount() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '' });

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    passwordsMatch: false,
  });

  const patterns = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
  };

  // Fetch user details and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user details
        const userResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}/with-role`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            throw new Error('Account not found');
          }
          throw new Error(`Failed to fetch user: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        
        // Fetch available roles
        const rolesResponse = await fetch(`https://fyp-backend-a0i8.onrender.com/api/roles/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let rolesData = [];
        if (rolesResponse.ok) {
          rolesData = await rolesResponse.json();
        }

        setUser(userData);
        setRoles(rolesData);
        setCurrentUsername(userData.username);
        setNewUsername(userData.username);
        setSelectedRoleId(userData.role_id || "");

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Password validation
  useEffect(() => {
    setValidation({
      length: newPassword.length >= 8,
      uppercase: patterns.uppercase.test(newPassword),
      lowercase: patterns.lowercase.test(newPassword),
      number: patterns.number.test(newPassword),
      specialChar: patterns.specialChar.test(newPassword),
      passwordsMatch: newPassword === confirmPassword && newPassword !== "",
    });
  }, [newPassword, confirmPassword]);

  const isPasswordValid = Object.values(validation).every(Boolean);
  const hasPasswordChanges = newPassword.trim() !== "";
  const hasUsernameChanges = newUsername !== currentUsername;
  const hasRoleChanges = selectedRoleId !== user?.role_id;
  const hasAnyChanges = hasPasswordChanges || hasUsernameChanges || hasRoleChanges;

  // API call functions
  const updatePassword = async () => {
    if (!hasPasswordChanges || !isPasswordValid) return true;

    try {
      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update password');
      }

      return true;
    } catch (error) {
      throw new Error(`Password update failed: ${error.message}`);
    }
  };

  const updateAccountDetails = async () => {
    if (!hasUsernameChanges && !hasRoleChanges) return true;

    try {
      const updateData = {};
      
      if (hasUsernameChanges) {
        updateData.username = newUsername;
      }

      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update account details');
      }

      return true;
    } catch (error) {
      throw new Error(`Account update failed: ${error.message}`);
    }
  };

  const updateUserRole = async () => {
    if (!hasRoleChanges) return true;

    try {
      const response = await fetch(`https://fyp-backend-a0i8.onrender.com/api/accounts/${userId}/update-role/${selectedRoleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update role');
      }

      return true;
    } catch (error) {
      throw new Error(`Role update failed: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!hasAnyChanges) {
      setResponseBox({ show: true, message: "No changes detected." });
      return;
    }

    if (hasPasswordChanges && !isPasswordValid) {
      setResponseBox({ show: true, message: "Please fix the password requirements before updating." });
      return;
    }

    setUpdating(true);
    
    try {
      // Update password first (if changed)
      await updatePassword();
      
      // Update account details (username)
      await updateAccountDetails();
      
      // Update role (if changed)
      await updateUserRole();

      setResponseBox({ show: true, message: "Account updated successfully!" });
      
    } catch (error) {
      console.error('Update failed:', error);
      setResponseBox({ show: true, message: `Update failed: ${error.message}` });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/user/${userId}`);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-update-container">
            <div className="loading-container">
              <div className="loading-spinner">Loading account details...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-update-container">
            <div className="error-container">
              <h2>Error Loading Account</h2>
              <p>{error || 'Account not found'}</p>
              <div className="error-actions">
                <button onClick={() => navigate('/admin/accounts')} className="admin-update-btn admin-update-btn-cancel">
                  Back to Accounts
                </button>
                <button onClick={() => window.location.reload()} className="admin-update-btn admin-update-btn-update">
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const displayName = user.profile?.name || user.username;

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-update-container">
          <h1 className="page-title">Update Account - {displayName}</h1>
          <p className="subtitle">Ensure the account is using appropriate settings and a strong password.</p>
          <hr className="section-divider" />

          <section className="section">
            <h2>Change password</h2>
            <label>
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="form-input"
                placeholder="Enter current password to change"
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="Leave blank to keep current password"
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm new password"
              />
            </label>
            
            {hasPasswordChanges && (
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
            )}
            <hr className="section-divider" />
          </section>

          <section className="section">
            <h2>Change username</h2>
            <label>
              Current username
              <input
                type="text"
                value={currentUsername}
                readOnly
                className="form-input"
              />
            </label>
            <label>
              New username
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                className="form-input"
              />
            </label>
            <hr className="section-divider" />
          </section>

          <section className="section">
            <h2>Change role</h2>
            <label>
              Current role
              <input
                type="text"
                value={user.role?.role_name || 'No role assigned'}
                readOnly
                className="form-input"
              />
            </label>
            <label>
              New role
              <select
                value={selectedRoleId}
                onChange={e => setSelectedRoleId(e.target.value)}
                className="form-select"
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <div className="admin-update-btn-container">
            <button 
              className="admin-update-btn admin-update-btn-cancel" 
              onClick={handleCancel}
              disabled={updating}
            >
              Cancel
            </button>
            <button 
              className="admin-update-btn admin-update-btn-update" 
              disabled={!hasAnyChanges || (hasPasswordChanges && !isPasswordValid) || updating}
              onClick={handleUpdate}
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </div>

          {/* Status indicators */}
          {hasAnyChanges && (
            <div className="changes-indicator">
              <p>Changes detected:</p>
              <ul>
                {hasPasswordChanges && <li>Password will be updated</li>}
                {hasUsernameChanges && <li>Username will be changed</li>}
                {hasRoleChanges && <li>Role will be updated</li>}
              </ul>
            </div>
          )}

          {responseBox.show && (
            <div className="adUpdateAcc-confirmation-overlay">
              <div className="adUpdateAcc-confirmation-box">
                <p>{responseBox.message}</p>
                <button onClick={closeResponseBox} className="adUpdateAcc-yes-button">Ok</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}