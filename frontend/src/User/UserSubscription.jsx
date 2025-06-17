// UserSubscription.jsx
import './UserDashboard.css';
import './userSubscription.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UserSubscription() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="user-dashboard">
      {/* 顶部导航 */}
      <div className="dashboard-header">
        <div className="menu-icon" onClick={toggleSidebar}>&#9776;</div>
        <div className="product-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="product-name">MaizeTassel AI</span>
        </div>
        <div
          className="avatar-box"
          onClick={() => navigate('/updateUserAccount')}
          style={{ cursor: 'pointer' }}
        >
          <img src={avatar} alt="User Avatar" className="avatar-img" />
        </div>
      </div>

      <div className="dashboard-body">
        {/* 左侧菜单栏 */}
        <div className={`usersidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="/userDashboard">Dashboard</a></li>
            <li><a href="/userupload">Upload image</a></li>
            <li><a href="/userResult">View result history</a></li>
            <li><a href="/userSubscription">Subscription</a></li>
            <li><a href="/reportBug">Report a Bug</a></li>
            <li><a href="/login">Log out</a></li>
          </ul>
        </div>

        {/* 主体内容 */}
        <main className="dashboard-content">
          <div className="subscription-container">
            <h2>Choose Your Plan</h2>
            <div className="plan-options">
              <div className="plan-card">
                <h3>FREE</h3>
                <p className="price">$0<span>/month</span></p>
                <ul>
                  <li>✓ Basic quota</li>
                  <li>✓ No re-detect</li>
                </ul>
                <button className="current-plan" disabled>Your Plan</button>
              </div>

              <div className="plan-card premium">
                <h3>PREMIUM</h3>
                <p className="price">$20<span>/month</span></p>
                <ul>
                  <li>✓ All features</li>
                  <li>✓ Re-detect</li>
                  <li>✓ Export results</li>
                </ul>
                <button className="upgrade-btn">Upgrade</button>
              </div>
            </div>
            <p className="payment-note">Secure payment. Cancel anytime.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
