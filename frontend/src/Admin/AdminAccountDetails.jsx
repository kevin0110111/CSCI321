import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminAccountDetails.css";

const allUsers = [
  { id: 1, name: "Leslie Alexander", email: "leslie.alexander@example.com", role: "Admin" },
  { id: 2, name: "Dries Vincent", email: "dries.vincent@example.com", role: "User" },
  { id: 3, name: "Michael Foster", email: "michael.foster@example.com", role: "Agent" },
  { id: 4, name: "Lindsay Walton", email: "lindsay.walton@example.com", role: "Admin" },
  { id: 5, name: "Courtney Henry", email: "courtney.henry@example.com", role: "Agent" },
  { id: 6, name: "Tom Cook", email: "tom.cook@example.com", role: "Premium User" }
];

// Define permissions list (same for all users here)
const permissionsList = [
  "Update Document",
  "Manage Accounts",
  "Access Database",
  "Use Systems",
  "Update Models",
  "Reply Comments"
];

// Simulate user permissions map
const userPermissionsMap = {
  1: ["Update Document", "Manage Accounts", "Access Database", "Use Systems"],
  2: ["Access Database"],
  3: ["Update Document", "Reply Comments"],
  4: ["Manage Accounts", "Use Systems"],
  5: ["Access Database", "Update Models"],
  6: ["Access Database", "Reply Comments"]
};

export default function AdminAccountDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const user = allUsers.find(u => u.id === Number(userId));

  if (!user) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="layout">
          <AdminSidebar />
          <main className="content">
            <h2>User not found</h2>
          </main>
        </div>
      </div>
    );
  }

  const userPermissions = userPermissionsMap[user.id] || [];

  const handleSuspendClick = () => {
    navigate(`/admin/suspend-user/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="layout">
        <AdminSidebar />
        <main className="admin-create-container">
          <h2 className="user-details-header">User Details</h2>

          <section className="user-info-section">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </section>

          <section>
            <h3 className="permissions">Permissions</h3>
            <ul className="permission-list">
              {permissionsList.map(permission => (
                <li key={permission}>
                  <input
                    type="checkbox"
                    checked={userPermissions.includes(permission)}
                    readOnly
                  />
                  <label>{permission}</label>
                </li>
              ))}
            </ul>
          </section>

          <div className="buttons-container">
            <button className="btn btn-danger" onClick={handleSuspendClick}>
              Suspend User
            </button>
            <button className="btn btn-success">Update Account</button>
          </div>
        </main>
      </div>
    </div>
  );
}
