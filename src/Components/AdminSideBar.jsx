import React from 'react';
import './AdminSidebar.css'; // Style this separately

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <ul>
        <li><a href="#"><span>📝</span> Create</a></li>
        <li><a href="#"><span>🔔</span> Notifications</a></li>
        <li><a href="#"><span>👁️</span> View</a></li>
      </ul>
    </aside>
  );
}
