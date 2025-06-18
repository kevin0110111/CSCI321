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
          <main className="admin-content">
            <h2>User not found</h2>
          </main>
        </div>
      </div>
    );
  }

  const handleSuspendClick = () => {
    navigate(`/admin/suspend-user/${userId}`);
  };

  const handleUpdateDetailsClick = () => {
    navigate(`/admin/update-user/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="layout">
        <AdminSidebar />
        <main className="admin-content">
          <h2 className="admin-user-details-header">User Details</h2>

          <section className="admin-user-info-section">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </section>

          <div className="admin-buttons-container">
            <button className="admin-btn admin-btn-danger" onClick={handleSuspendClick}>
              Suspend User
            </button>
            <button className="admin-btn admin-btn-success" onClick={handleUpdateDetailsClick}>
              Update Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
