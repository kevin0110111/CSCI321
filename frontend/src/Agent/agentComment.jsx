import './agentComment.css';
import model from '../assets/model.svg';
import comment from '../assets/comment.svg'
import reportBug from '../assets/bug.svg'
import faq from '../assets/faq.svg'
import logout from '../assets/logout.svg'
import previousIcon from '../assets/previous.svg';
import nextIcon from '../assets/next.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AgentComment() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // This would typically come from your API
  const navigate = useNavigate();

  const modelCards = [
    { id: 1, name: "cx033", updatedAt: "2023-10-15 14:30" },
    { id: 2, name: "Jhon", updatedAt: "2023-10-14 09:15" },
    { id: 3, name: "Mavrict", updatedAt: "2023-10-13 16:45" },
    { id: 4, name: "Hendrix", updatedAt: "2023-10-12 11:20" },
    { id: 5, name: "Erry99", updatedAt: "2023-10-11 13:10" },
  ];

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleUpdate = () => {
    // Add your update logic here
    console.log("Update button clicked");
  };

  const handleDoubleClick = () => {
    navigate('/viewComment');
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  const AgentLogout = () => {
    navigate('/login');
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="agentsidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
            <Link to="/agentModel" className="nav-link"><img src={model} alt="Model" className="icon"/> Model</Link>
            <Link to="/agentComment" className="nav-link active"><img src={comment} alt="Comment" className="icon"/> Comment</Link>
            <Link to="/agentBugReport" className="nav-link"><img src={reportBug} alt="ReportedBug" className="icon"/> Reported Bug</Link>
            <Link to="/agentFAQ" className="nav-link"><img src={faq} alt="FAQ" className="icon"/> FAQ</Link>
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
          <h1>Dashboard - Comment</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* Model Cards */}
        <main className="model-cards-container">
          {modelCards.map((model) => (
            <div key={model.id} className="model-card" onDoubleClick={handleDoubleClick}>
              <div className="model-info">
                <span className="model-number">{model.id}.</span>
                <div>
                  <div className="model-name">User name: {model.name}</div>
                  <div className="model-updated">Commented at: {model.updatedAt}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              onClick={handlePrevious} 
              disabled={currentPage === 1}
              className="pagination-button"
              aria-label="Previous"
            >
              <img src={previousIcon} alt="Previous" className="pagination-icon" />
            </button>
            
            <div className="page-indicator">
              {currentPage} of {totalPages}
            </div>
            
            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages}
              className="pagination-button"
              aria-label="Next"
            >
              <img src={nextIcon} alt="Next" className="pagination-icon" />
            </button>

          </div>
        </main>
      </div>
    </div>
  );
}
