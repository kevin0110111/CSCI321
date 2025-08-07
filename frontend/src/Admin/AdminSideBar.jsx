import React from 'react';
import { Link } from 'react-router-dom';  // Use react-router Link for SPA navigation
import './AdminSideBar.css';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <ul>
        <li>
          <Link to="/admin/create-account">
            <span role="img" aria-label="create">📝</span> Create
          </Link>
        </li>
        <li>
          <Link to="/admin/view-accounts">
            <span role="img" aria-label="view">👁️</span> View
          </Link>
        </li>
        <li>
          <Link to="/admin/view-models">
            <span role="img" aria-label="view">🤖</span> Model
          </Link>
        </li>
        <li>
          <Link to="/login">
            <span role="img" aria-label="logout">🚪</span> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}
