import './viewBugReport.css';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewBugReport() {
  const navigate = useNavigate();
  const { bug_id } = useParams();
  const [bugReport, setBugReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugReport = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8000/api/bugreports/${bug_id}`);
        
        // Format the date
        const formattedReport = {
          ...response.data,
          created_at: formatDate(response.data.created_at),
          username: response.data.user?.username || 'Anonymous'
        };
        
        setBugReport(formattedReport);
      } catch (err) {
        console.error('Error fetching bug report:', err);
        setError('Failed to load bug report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBugReport();
  }, [bug_id]);

  // Format date to display as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  const handleBack = () => {
    navigate('/agentBugReport');
  };

  const AgentLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="agentsidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
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
          <h1>View Reported Bug</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* Bug Report Section */}
        <main className="comment-container">
          {isLoading ? (
            <div className="loading">Loading bug report...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : bugReport ? (
            <>
              <div className="user-info">
                <h2>User: {bugReport.user?.username || `User ${comment.user_id}`}</h2>
                <h2>Title: {bugReport.title}</h2>
                <h2>Reported at: {bugReport.created_at}</h2>
              </div>

              <div className="comment-section">
                <h3>Description:</h3>
                <div className="report-box">
                  <p>{bugReport.description}</p>
                </div>
              </div>

              {bugReport.resolution_note && (
                <div className="comment-section">
                  <h3>Resolution Note:</h3>
                  <div className="report-box">
                    <p>{bugReport.resolution_note}</p>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button onClick={handleBack} className="back-button">Back</button>
              </div>
            </>
          ) : (
            <div className="no-report">Bug report not found</div>
          )}
        </main>
      </div>
    </div>
  );
}