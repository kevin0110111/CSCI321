import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminTopBar.css';

export default function AdminTopBar() {
  const navigate = useNavigate();
  const path = useLocation().pathname.toLowerCase();

  const handleAccountClick = (e) => {
    e.preventDefault();
    // If currently on create-profile page, clicking Account goes to create-account
    if (path.includes('create-profile')) {
      navigate('/admin/create-account');
    } else if (path.includes('account') && path.includes('create')) {
      navigate('/admin/create-account');
    } else {
      navigate('/admin/view-accounts');
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    // If currently on create-account page, clicking Profile goes to create-profile
    if (path.includes('create-account')) {
      navigate('/admin/create-profile');
    } else if (path.includes('profile') && path.includes('create')) {
      navigate('/admin/create-profile');
    } else if (path.includes('profile')) {
      navigate('/admin/view-profiles');
    } else {
      navigate('/admin/view-profiles');
    }
  };

  const isAccountActive = path.includes('account');
  const isProfileActive = path.includes('profile');

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
        <a
          href="/admin/view-accounts"
          className={isAccountActive ? 'active-link' : ''}
          onClick={handleAccountClick}
        >
          Account
        </a>
        <span className="admin-divider">|</span>
        <a
          href="/admin/view-profiles"
          className={isProfileActive ? 'active-link' : ''}
          onClick={handleProfileClick}
        >
          Profile
        </a>
      </div>

      <div className="admin-icons">
        <span role="img" aria-label="moon">🌓</span>
        <span role="img" aria-label="notifications">🔔</span>
        <span role="img" aria-label="user">👤</span>
      </div>
    </header>
  );
}
