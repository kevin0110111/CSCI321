// SwitchLanguage.jsx
import './UserDashboard.css';
import './switchLanguage.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SwitchLanguage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSelectLanguage = (langLabel) => {
    setSelectedLang(langLabel);
    // 可选：你可以在这里使用 i18n 切换语言
    // i18n.changeLanguage(langCode)
  };

  return (
    <div className="user-dashboard">
      {/* 顶部导航栏 */}
      <div className="dashboard-header">
        <div className="menu-icon" onClick={toggleSidebar}>&#9776;</div>
        <div className="product-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="product-name">MaizeTassel AI</span>
        </div>
        <div className="avatar-box" onClick={() => navigate('/updateUserAccount')} style={{ cursor: 'pointer' }}>
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

        {/* 内容部分 */}
        <main className="dashboard-content">
          <div className="language-container">
            <h2>Switch Language</h2>
            <p>Please select your language:</p>
            <div className="language-options">
              <button onClick={() => handleSelectLanguage('English')}>English</button>
              <button onClick={() => handleSelectLanguage('中文（简体）')}>中文</button>
              <button onClick={() => handleSelectLanguage('Español')}>Español</button>
              <button onClick={() => handleSelectLanguage('Français')}>Français</button>
            </div>
            {selectedLang && (
              <div className="lang-confirm">
                Language changed to {selectedLang}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
