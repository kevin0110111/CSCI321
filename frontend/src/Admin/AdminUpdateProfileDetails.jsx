import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminUpdateProfileDetails.css";

const allRoles = [
  {
    id: 1,
    role: "Admin",
    permissions: ["Update Account", "Manage Accounts", "Access Database", "Use System", "Update Models", "Reply Comments"],
  },
  {
    id: 2,
    role: "User",
    permissions: ["Use System", "Reply Comments"],
  },
  {
    id: 3,
    role: "Agent",
    permissions: ["Manage Accounts", "Access Database", "Use System"],
  },
  {
    id: 4,
    role: "Premium User",
    permissions: ["Use System", "Reply Comments", "Update Account"],
  },
];

const allPermissions = [
  "Update Account",
  "Manage Accounts",
  "Access Database",
  "Use System",
  "Update Models",
  "Reply Comments"
];

export default function AdminUpdateProfileDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const role = allRoles.find(r => r.id === Number(roleId));

  const [newName, setNewName] = useState("");
  const [confirmName, setConfirmName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(role ? [...role.permissions] : []);

  if (!role) {
    return (
      <div className="admin-update-profile-dashboard">
        <AdminTopBar />
        <div className="admin-update-profile-layout">
          <AdminSidebar />
          <main className="admin-update-profile-content">
            <h2>Role not found</h2>
          </main>
        </div>
      </div>
    );
  }

  const handlePermissionChange = (perm) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleUpdate = () => {
    // Add your update logic here
    alert(`Updated Profile:
Old Name: ${role.role}
New Name: ${newName}
Permissions: ${selectedPermissions.join(", ")}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <h1 className="admin-update-profile-title">UPDATE PROFILE</h1>
          <p className="admin-update-profile-warning">Ensure the permissions are not abused</p>
          <hr className="admin-update-profile-divider" />

          {/* Change Profile Name Section */}
          <section className="admin-update-profile-section">
            <h2 className="admin-update-profile-section-title">Change Profile Name</h2>
            <label className="admin-update-profile-label">
              Current Name
              <input type="text" className="admin-update-profile-input" value={role.role} readOnly />
            </label>
            <label className="admin-update-profile-label">
              New Name
              <input
                type="text"
                className="admin-update-profile-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new profile name"
              />
            </label>
            <label className="admin-update-profile-label">
              Confirm Name
              <input
                type="text"
                className="admin-update-profile-input"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder="Confirm new profile name"
              />
            </label>
          </section>

          <hr className="admin-update-profile-divider" />

          {/* Change Permissions Section */}
          <section className="admin-update-profile-section">
            <h2 className="admin-update-profile-section-title">Change Permissions</h2>
            <fieldset className="admin-update-profile-permissions-fieldset">
              <legend className="admin-update-profile-permissions-legend">Permissions</legend>
              {allPermissions.map((perm) => (
                <label key={perm} className="admin-update-profile-permission-label">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
                  />
                  <span className="admin-update-profile-permission-text">{perm}</span>
                </label>
              ))}
            </fieldset>
          </section>

          <hr className="admin-update-profile-divider" />

          {/* Buttons */}
          <div className="admin-update-profile-buttons">
            <button
              className="admin-update-profile-btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="admin-update-profile-btn-update"
              onClick={handleUpdate}
              disabled={newName === "" || newName !== confirmName}
              title={newName === "" || newName !== confirmName ? "Enter and confirm new name" : ""}
            >
              Update
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
