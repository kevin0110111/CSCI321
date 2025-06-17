// UserResultHistory.jsx
import './userResult.css';
import './UserDashboard.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UserResultHistory() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const results = [
    {
      id: 1,
      title: 'Annotated image',
      date: 'Jun 10, 2023, 2:15 PM',
      imageUrl: '/images/pic1.jpg',
      count: 47,
      time: '1.2s',
      size: '1920 x 1080',
    },
    {
      id: 2,
      title: 'Annotated image',
      date: 'Jun 10, 2023, 2:15 PM',
      imageUrl: '/images/pic2.jpg',
      count: 32,
      time: '0.9s',
      size: '1280 x 720',
    },
    {
      id: 3,
      title: 'Annotated image',
      date: 'Jun 10, 2023, 2:15 PM',
      imageUrl: '/images/pic3.jpg',
      count: 51,
      time: '1.5s',
      size: '1920 x 1080',
    },
  ];

  return (
    <div className="user-dashboard">
      {/* 顶部导航 */}
      <div className="dashboard-header">
        <div className="menu-icon" onClick={toggleSidebar}>
          &#9776;
        </div>
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
        {/* 侧边栏 */}
        <div className={`usersidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="/userDashboard">Dashboard</a></li>
            <li><a href="/userupload">Upload image</a></li>
            <li><a href="/userResult">View result history</a></li>
            <li><a href="/userSubscription">Subscription</a></li>
            <li><a href="/reportBug">Report a Bug</a></li>
            <li><a href="/leaveComment">Leave a Comment</a></li>
            <li><a href="/userComments">User Comments</a></li>
            <li><a href="/switchLanguage">Switch Language</a></li>
            <li><a href="/login">Log out</a></li>
          </ul>
        </div>

        {/* 内容区 */}
        <main className="dashboard-content">
          <div className="result-list-container">
            <h2>My Results</h2>
            {results.map((item) => (
              <div className="result-row" key={item.id}>
                <img src={item.imageUrl} alt="Thumbnail" className="result-thumb" />
                <div className="result-meta">
                  <div className="result-title">{item.title}</div>
                  <div className="result-date">{item.date}</div>
                </div>
                <div className="result-actions">
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate('/user/resultview', {
                        state: item,
                      })
                    }
                  >
                    View
                  </button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
