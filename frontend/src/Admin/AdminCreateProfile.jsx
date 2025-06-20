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

  const handleCheckboxChange = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission (e.g., API call)
    alert(`Profile Name: ${profileName}\nPermissions: ${selectedPermissions.join(", ")}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-create-profile-container">
          <h1 className="admin-page-title">Create New Profile (Role)</h1>
          <hr className="admin-section-divider" />

          <form className="admin-create-profile-form" onSubmit={handleSubmit}>
            <label className="admin-form-label">
              Profile Name
              <input
                type="text"
                className="admin-form-input"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
                placeholder="Enter profile name"
              />
            </label>
            <hr className="admin-section-divider" />
            
            <fieldset className="admin-permissions-fieldset">
              <legend className="admin-permissions-legend">Profile Permission</legend>
              {permissionsList.map((perm) => (
                <label key={perm} className="admin-permission-label">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handleCheckboxChange(perm)}
                  />
                  <span className="admin-permission-text">{perm}</span>
                </label>
              ))}
            </fieldset>
            <hr className="admin-section-divider" />
            <button type="submit" className="admin-create-btn-submit">
              Save
            </button>
           
          </form>
          
        </main>
      </div>
    </div>
  );
}
