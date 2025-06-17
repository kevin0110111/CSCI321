// ReportBug.jsx
import './UserDashboard.css';
import './reportBug.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ReportBug() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里你可以添加真正的提交逻辑，比如 POST 到后端 API
    console.log({ title, description, file });
    setSubmitted(true);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setSubmitted(false);
  };

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

        {/* 内容部分 */}
        <main className="dashboard-content">
          <form className="bug-form" onSubmit={handleSubmit}>
            <h2 className="bug-title">🐞 Report a Bug</h2>

            <label>Bug Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label>Attach Screenshot (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="bug-actions">
              <button type="button" onClick={handleReset}>Cancel</button>
              <button type="submit">Submit Bug Report</button>
            </div>

            {submitted && (
              <div className="bug-success">Bug report submitted successfully</div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}
