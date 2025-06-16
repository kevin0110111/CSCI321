import './viewBugReport.css';
import model from '../assets/model.svg';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ViewBugReport() {
  const navigate = useNavigate();
  const [reply, setReply] = useState('');

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = () => {
    // Handle reply submission logic
    console.log('Reply submitted:', reply);
    setReply('');
  };

  const handleDelete = () => {
    // Handle delete logic
    console.log('Comment deleted');
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar remains the same */}
      <aside className="sidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
            <Link to="/agentModel" className="nav-link">
              <img src={model} alt="Model" className="icon"/> Model
            </Link>
            <Link to="/agentComment" className="nav-link">
              <img src={comment} alt="Comment" className="icon"/> Comment
            </Link>
            <Link to="/agentBugReport" className="nav-link active">
              <img src={reportBug} alt="ReportedBug" className="icon"/> Reported Bug
            </Link>
            <Link to="/agentFAQ" className="nav-link">
              <img src={faq} alt="FAQ" className="icon"/> FAQ
            </Link>
          </div>
          <div className="logout-container">
            <a href="#" className="nav-link">
              <img src={logout} alt="Logout" className="icon"/> Logout
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-section">
        {/* Header */}
        <header className="header">
          <h1>View reported bug</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* Comment Section */}
        <main className="comment-container">
          <div className="user-info">
            <h2>User name: cx033</h2>
            <h2>Title: Upload image bug</h2>
            <h2>Reported at: 12-10-2025</h2>
          </div>

          <div className="comment-section">
            <h3>Reported bug:</h3>
            <div className="report-box">
              <p>This is the user's comment content. It can be long and should be scrollable if it exceeds the box height.
                sfdjjngjnfjgnfjngjfngjnfjgnjfngjnfgjnj
                sfdfgdh
                sdgfgfhggdh
                dgfdgfhh
                sdgfgfhggdhfgf
                sdfggs
                ddffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                dgfdfewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
                errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrretg
                gdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                sddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
              </p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="back-button">Back</button>
          </div>
        </main>
      </div>
    </div>
  );
}
