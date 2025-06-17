import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminTopBar from './AdminTopBar';
import AdminSidebar from './AdminSidebar';
import "./AdminSuspendUser.css";

export default function AdminSuspendUser() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const allUsers = [
    { id: "1", name: "Leslie Alexander", email: "leslie.alexander@example.com", role: "Admin" },
    { id: "2", name: "Dries Vincent", email: "dries.vincent@example.com", role: "User" },
    { id: "3", name: "Michael Foster", email: "michael.foster@example.com", role: "Agent" },
    { id: "4", name: "Lindsay Walton", email: "lindsay.walton@example.com", role: "Admin" },
    { id: "5", name: "Courtney Henry", email: "courtney.henry@example.com", role: "Agent" },
    { id: "6", name: "Tom Cook", email: "tom.cook@example.com", role: "Premium User" }
  ];

  const user = allUsers.find(u => u.id === userId);

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("one_day");
  const [customDays, setCustomDays] = useState("");

  if (!user) {
    return <div className="admin-dashboard"><p>User not found.</p></div>;
  }

  const handleSubmit = () => {
    alert(`Suspending user ${user.name} for ${duration === "custom" ? customDays + " days" : duration.replace('_', ' ')}`);
    // Add your suspend logic here, then navigate as needed:
    // navigate('/admin/view-accounts');
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="layout">
        <AdminSidebar />
        <main className="admin-create-container">
          <h1 className="user-details-header">Suspend Confirmation</h1>
          <p>You are trying to suspend account</p>
          <p className="user-id-name"><strong>{user.id} ({user.name})</strong></p>

          <label className="form-label">
            Reason
            <textarea
              className="form-textarea"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason for suspension"
              rows={5}
            />
          </label>

          <label className="form-label">
            Suspend duration
            <select
              className="form-select"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            >
              <option value="one_day">One day</option>
              <option value="one_month">One month</option>
              <option value="one_year">One year</option>
              <option value="permanent_ban">Permanent ban</option>
              <option value="custom">Custom (days)</option>
            </select>
          </label>

          {duration === "custom" && (
            <input
              type="number"
              className="form-input"
              value={customDays}
              onChange={e => setCustomDays(e.target.value)}
              placeholder="Enter number of days"
              min={1}
            />
          )}

          <div className="buttons-container">
            <button className="btn btn-danger1" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn btn-success" onClick={handleSubmit}>Confirm</button>
          </div>
        </main>
      </div>
    </div>
  );
}
