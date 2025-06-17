// UserComments.jsx
import './UserDashboard.css';
import './userComments.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import userIcon from '../assets/logo.png'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UserComments() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const allComments = [
    {
      id: 1,
      username: 'Username',
      content: 'Great feature set, but UI can be improved.',
      time: '2024-06-03 09:15 AM',
    },
    {
      id: 2,
      username: 'Username',
      content: 'Detection results are accurate and fast!',
      time: '2024-06-02 16:47 PM',
    },
    {
      id: 3,
      username: 'Username',
      content: 'Helpful app',
      time: '2024-06-01 21:10 PM',
    },
    {
      id: 4,
      username: 'Username',
      content: 'Really nice experience.',
      time: '2024-05-30 18:20 PM',
    },
    {
      id: 5,
      username: 'Username',
      content: 'I like the language switch feature.',
      time: '2024-05-29 13:45 PM',
    }
  ];

  const visibleComments = allComments.slice(0, visibleCount);

  return (
    <div className="user-dashboard">
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

        <main className="dashboard-content">
          <div className="comments-container">
            <h2>User Comments</h2>
            <hr />
            {visibleComments.map(comment => (
              <div className="comment-item" key={comment.id}>
                <img src={userIcon} alt="User" className="comment-avatar" />
                <div className="comment-content">
                  <strong>{comment.username}</strong>
                  <p>{comment.content}</p>
                  <span className="comment-time">{comment.time}</span>
                </div>
              </div>
            ))}
            {visibleCount < allComments.length && (
              <div className="load-more">
                <button onClick={() => setVisibleCount(visibleCount + 3)}>Load More</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
