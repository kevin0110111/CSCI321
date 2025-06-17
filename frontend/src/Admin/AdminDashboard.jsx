// src/pages/AdminDashboard.jsx  (adjust the path to where you keep pages)
import React from 'react';
import AdminTopBar   from './AdminTopBar';   // <- update path as needed
import AdminSidebar from './AdminSidebar';
import './AdminDashboard.css';                          // (optional) page-specific styles

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* top bar */}
      <AdminTopBar />

      {/* main layout: sidebar + content */}
      <div className="layout">
        <AdminSidebar />

        <main className="content">
          <h1>Welcome to Maize Tussel Admin!</h1>
          {/* add dashboard widgets here */}
        </main>
      </div>
    </div>
  );
}
