import React from 'react';
import './AdminTopBar.css';

export default function AdminTopBar() {
  return (
    <header className="top-nav">
      <div className="logo">
        <span className="logo-icon">🌽</span>
        Logo
      </div>

      <div className="top-center">
        <a href="#">Account</a>
        <span className="divider">|</span>
        <a href="#">Profile</a>
      </div>

      <div className="icons">
        <span>🔔</span>
        <span>📂</span>
        <span>👤</span>
      </div>
    </header>
  );
}
