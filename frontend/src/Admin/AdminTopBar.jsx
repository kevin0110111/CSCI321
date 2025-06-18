import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminTopBar.css';

export default function AdminTopBar() {
  const navigate = useNavigate();

  return (
    <header className="admin-top-nav">
      <div
        className="admin-logo"
        role="button"
        tabIndex={0}
        onClick={() => navigate('/admin/home')}
        onKeyPress={(e) => e.key === 'Enter' && navigate('/admin/home')}
        style={{ cursor: 'pointer' }}
        aria-label="Go to admin home"
      >
        <span className="admin-logo-icon" role="img" aria-label="corn">🌽</span>
        Logo
      </div>

      <div className="admin-top-center">
        <a href="#">Account</a>
        <span className="admin-divider">|</span>
        <a href="#">Profile</a>
      </div>

      <div className="admin-icons">
        <span role="img" aria-label="moon">🌓</span>
        <span role="img" aria-label="notifications">🔔</span>
        <span role="img" aria-label="user">👤</span>
      </div>
    </header>
  );
}
