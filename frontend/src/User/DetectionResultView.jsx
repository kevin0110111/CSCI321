// DetectionResultView.jsx
import './userResult.css';
import './UserDashboard.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function DetectionResultView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const result = location.state || {
    id: 1,
    title: 'Annotated Image',
    date: 'Jun 10, 2023, 2:15 PM',
    imageUrl: '/images/pic1.jpg',
    count: 47,
    time: '1.2s',
    size: '1920 x 1080'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="menu-icon" onClick={toggleSidebar}>
          &#9776;
        </div>
        <div className="product-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="product-name">MaizeTassel AI</span>
        </div>
        <div className="avatar-box" onClick={() => navigate('/updateUserAccount')} style={{ cursor: 'pointer' }}>
          <img src={avatar} alt="User Avatar" className="avatar-img" />
        </div>
      </div>

      <div className="dashboard-body">
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

        <main className="dashboard-content">
          <div className="detection-container">
            <h2 className="detection-title">Detection Result</h2>
            <div className="detection-grid">
              <img src={result.imageUrl} alt="Annotated" className="detection-image" />
              <div className="detection-info">
                <p><strong>Total Maize Count:</strong> {result.count}</p>
                <p><strong>Processing Time:</strong> {result.time}</p>
                <p><strong>Image Size:</strong> {result.size}</p>
              </div>
            </div>
            <div className="detection-buttons">
              <button className="btn">Cancel</button>
              <button className="btn save">Save</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
