import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminProfileDetails.css";

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

export default function AdminProfileDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const role = allRoles.find(r => r.id === Number(roleId));

  if (!role) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content">
            <h2>Role not found</h2>
          </main>
        </div>
      </div>
    );
  }

  return (
    
    <div className="admin-dashboard">
      <AdminTopBar />
      
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <h1 className="admin-page-title">Role Details - {role.role}</h1>
          <hr className="admin-section-divider-profile-details" />
          <div className="admin-role-details-container">
            <label className="admin-form-label">
              Role Name
              <input
                type="text"
                className="admin-form-input"
                value={role.role}
                readOnly
              />
            </label>
            <hr className="admin-section-divider-profile-details" />
            <fieldset className="admin-permissions-fieldset">
              
              <legend className="admin-permissions-legend">Permissions</legend>
              {[
                "Update Account",
                "Manage Accounts",
                "Access Database",
                "Use System",
                "Update Models",
                "Reply Comments",
              ].map((perm) => (
                <label key={perm} className="admin-permission-label">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(perm)}
                    disabled
                  />
                  <span className="admin-permission-text">{perm}</span>
                </label>
              ))}
            </fieldset>
            <hr className="admin-section-divider-profile-details" />
            <div className="admin-buttons-container">

            
                <button
                className="admin-btn-back"
                onClick={() => navigate(-1)}
                style={{ marginTop: "20px" }}
                >
                Cancel
                </button>
                <button
                className="admin-btn-update"
                onClick={() => navigate(`/admin/update-profile/${role.id}`)}
                style={{ marginTop: "20px" }}
                >
                Update 
                </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
