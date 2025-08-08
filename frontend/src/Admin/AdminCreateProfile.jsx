import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminCreateProfile.css";

const permissionsList = [
  "Update Account",
  "Manage Accounts",
  "Access Database",
  "Use System",
  "Update Models",
  "Reply Comments",
];

export default function AdminCreateProfile() {
  const [profileName, setProfileName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '' });
  
  const navigate = useNavigate();

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
  };

  const handleCheckboxChange = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseBox({ show: false, message: '' });

    try {
      // Prepare the role data
      const roleData = {
        role_name: profileName,
        description: selectedPermissions.join(", "), // Use permissions as description
        state: "active" // Default state
      };

      // Make API call to create role
      const response = await fetch('https://fyp-backend-a0i8.onrender.com/api/roles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create role');
      }

      const createdRole = await response.json();
      setResponseBox({ show: true, message: `Role "${createdRole.role_name}" created successfully!` });
      
      // Reset form
      setProfileName("");
      setSelectedPermissions([]);

    } catch (err) {
      setResponseBox({ show: true, message: err.message || 'An error occurred while creating the role' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-create-profile-container">
          <h1 className="admin-page-title">Create New Role</h1>
          <hr className="admin-section-divider" />

          <form className="admin-create-profile-form" onSubmit={handleSubmit}>
            <label className="admin-form-label">
              Role Name
              <input
                type="text"
                className="admin-form-input"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                placeholder="Enter role name"
                disabled={isLoading}
              />
            </label>
            <hr className="admin-section-divider" />
            
            <fieldset className="admin-permissions-fieldset">
              <legend className="admin-permissions-legend">Role Permission</legend>
              {permissionsList.map((perm) => (
                <label key={perm} className="admin-permission-label">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handleCheckboxChange(perm)}
                    disabled={isLoading}
                  />
                  <span className="admin-permission-text">{perm}</span>
                </label>
              ))}
            </fieldset>
            <hr className="admin-section-divider" />
            <button 
              type="submit" 
              className="admin-create-btn-submit"
              disabled={isLoading || !profileName.trim()}
            >
              {isLoading ? 'Creating...' : 'Save'}
            </button>
           
          </form>
          
        </main>
      </div>

      {responseBox.show && (
        <div className="adCreateRol-confirmation-overlay">
          <div className="adCreateRole-confirmation-box">
            <p>{responseBox.message}</p>
            <button onClick={closeResponseBox} className="adCreateRole-yes-button">Ok</button>
          </div>
        </div>
      )}
    </div>
  );
}