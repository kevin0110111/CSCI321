// UserComment.jsx
import './UserDashboard.css';
import './LeaveComment.css';
import avatar from '../assets/logo.png';
import logo from '../assets/faq.svg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function UserComment() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const maxLength = 250;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Comment:', comment);
    setSubmitted(true);
  };

  const handleCancel = () => {
    setComment('');
    setSubmitted(false);
  };

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
          <form className="comment-form" onSubmit={handleSubmit}>
            <h2 className="comment-title">Leave a Comment</h2>
            <textarea
              placeholder="Enter your comment..."
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) setComment(e.target.value);
              }}
            />
            <div className="char-count">
              {maxLength - comment.length} characters remaining
            </div>
            <div className="comment-actions">
              <button type="button" onClick={handleCancel}>Cancel</button>
              <button type="submit">Submit Comment</button>
            </div>
            {submitted && <div className="thank-you">Thank you for your feedback!</div>}
          </form>
        </main>
      </div>
    </div>
  );
}
