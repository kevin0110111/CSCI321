import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminSidebar from "./AdminSidebar";
import "./AdminUpdateAccountDetails.css";

const allUsers = [
  { id: 1, name: "Leslie Alexander", username: "leslie.alex", role: "Admin" },
  { id: 2, name: "Dries Vincent", username: "dries.vincent", role: "User" },
  { id: 3, name: "Michael Foster", username: "michael.foster", role: "Agent" },
  { id: 4, name: "Lindsay Walton", username: "lindsay.walton", role: "Admin" },
  { id: 5, name: "Courtney Henry", username: "courtney.henry", role: "Agent" },
  { id: 6, name: "Tom Cook", username: "tom.cook", role: "Premium User" }
];

export default function UpdateAccount() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = allUsers.find(u => u.id === Number(userId));

  if (!user) {
    return (
      <div className="admin-dashboard">
        <AdminTopBar />
        <div className="layout">
          <AdminSidebar />
          <main className="admin-update-container">
            <h2>User not found</h2>
          </main>
        </div>
      </div>
    );
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUsername, setCurrentUsername] = useState(user.username);
  const [newUsername, setNewUsername] = useState(user.username);
  const [profile, setProfile] = useState(user.role);

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

  const isValid = Object.values(validation).every(Boolean);

  const handleUpdate = () => {
    if (!isValid) {
      alert("Please fix the password requirements before updating.");
      return;
    }
    alert(`Updating user ${user.name} with new username: ${newUsername} and role: ${profile}`);
    navigate(`/admin/user/${userId}`);
  };

  const handleCancel = () => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div className="admin-dashboard">
      <AdminTopBar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-update-container">
          <h1 className="page-title">Update Account - {user.name}</h1>
          <p className="subtitle">Ensure your account is using a strong password.</p>
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
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="form-input"
              />
            </label>
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </label>
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
            <h2>Change profile</h2>
            <label>
              Profile
              <select
                value={profile}
                onChange={e => setProfile(e.target.value)}
                className="form-select"
              >
                <option value="Agent">Agent</option>
                <option value="User">User</option>
                <option value="Premium User">Premium User</option>
                <option value="Admin">Admin</option>
              </select>
            </label>
          </section>

          <div className="admin-update-btn-container">
            <button className="admin-update-btn admin-update-btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="admin-update-btn admin-update-btn-update" disabled={!isValid} onClick={handleUpdate}>Update</button>
          </div>
        </main>
      </div>
    </div>
  );
}
