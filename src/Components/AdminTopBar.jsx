import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminTopBar.css';

export default function AdminTopBar() {
  const navigate = useNavigate();

  return (
    <header className="top-nav">
      <div
        className="logo"
        role="button"
        tabIndex={0}
        onClick={() => navigate('/admin/home')}
        onKeyPress={(e) => e.key === 'Enter' && navigate('/admin/home')}
        style={{ cursor: 'pointer' }}
        aria-label="Go to admin home"
      >
        <span className="logo-icon" role="img" aria-label="corn">🌽</span>
        Logo
      </div>

      <div className="top-center">
        <a href="#">Account</a>
        <span className="divider">|</span>
        <a href="#">Profile</a>
      </div>

      <div className="icons">
        <span role="img" aria-label="moon">🌓</span>
        <span role="img" aria-label="notifications">🔔</span>
        <span role="img" aria-label="user">👤</span>
      </div>
    </header>
  );
}
