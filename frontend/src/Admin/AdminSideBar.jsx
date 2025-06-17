import React from 'react';
import { Link } from 'react-router-dom';  // Use react-router Link for SPA navigation
import './AdminSidebar.css';

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
          <Link to="/admin/notifications">
            <span role="img" aria-label="notifications">🔔</span> Notifications
          </Link>
        </li>
        <li>
          <Link to="/admin/view-accounts">
            <span role="img" aria-label="view">👁️</span> View
          </Link>
        </li>
      </ul>
    </aside>
  );
}
