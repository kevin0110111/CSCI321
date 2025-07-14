import './viewFAQ.css';
import model from '../assets/model.svg';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function ViewFAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreating = location.state?.isCreating || false;

  const [reply, setReply] = useState('');
  const [faqTitle, setFaqTitle] = useState('How to upload images?');

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleTitleChange = (e) => {
    setFaqTitle(e.target.value);
  };

  const handleUpdate = () => {
    // Handle update logic
    console.log('FAQ updated:', reply);
    setReply('');
  };

  const handleCreate = () => {
    // Handle create logic
    console.log('New FAQ created:', reply);
    setReply('');
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('FAQ deleted');
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  const AgentLogout = () => {
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar remains the same */}
      <aside className="agentsidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
            <Link to="/agentComment" className="nav-link">
              <img src={comment} alt="Comment" className="icon"/> Comment
            </Link>
            <Link to="/agentBugReport" className="nav-link">
              <img src={reportBug} alt="ReportedBug" className="icon"/> Reported Bug
            </Link>
            <Link to="/agentFAQ" className="nav-link active">
              <img src={faq} alt="FAQ" className="icon"/> FAQ
            </Link>
          </div>
          <div className="logout-container">
            <button onClick={AgentLogout} className="nav-link agent-logout-button">
              <img src={logout} alt="Logout" className="icon"/> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        {/* Header */}
        <header className="header">
          <h1>{isCreating ? 'Create FAQ' : 'View FAQ'}</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* Comment Section */}
        <main className="comment-container">
          <div className="user-info">
            <h2>FAQ Title:</h2>
            <textarea
              value={faqTitle}
              onChange={handleTitleChange}
              className="FAQTitle-box"
            />
          </div>

          <div className="reply-section">
            <h3>Content:</h3>
            <textarea
              value={reply}
              onChange={handleReplyChange}
              placeholder="Type your content here..."
              className="FAQContent-box"
            />
          </div>

          <div className="action-buttons">
            {isCreating ? (
              <button className="reply-button" onClick={handleCreate}>Create</button>
            ) : (
              <>
                <button className="reply-button" onClick={handleUpdate}>Update</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>
              </>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
          </div>
        </main>
      </div>
    </div>
  );
}
