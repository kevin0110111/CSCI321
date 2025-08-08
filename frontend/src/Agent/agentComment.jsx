import './agentComment.css';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import previousIcon from '../assets/previous.svg';
import nextIcon from '../assets/next.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AgentComment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const commentsPerPage = 5;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        // Fetch comments with user data included using joinedload
        const response = await axios.get(`https://fyp-backend-a0i8.onrender.com/api/comments/`, {
          params: {
            skip: (currentPage - 1) * commentsPerPage,
            limit: commentsPerPage
          }
        });
        
        // Format the date and ensure username is available
        const formattedComments = response.data.map(comment => ({
          ...comment,
          created_at: formatDate(comment.created_at),
          username: comment.user?.username || 'Anonymous'
        }));
        
        setComments(formattedComments);
        
        // Get total count for pagination
        const countResponse = await axios.get('https://fyp-backend-a0i8.onrender.com/api/comments/count');
        setTotalPages(Math.ceil(countResponse.data.total / commentsPerPage));
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [currentPage]);

  // Format date to display as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDoubleClick = (commentId) => {
    navigate(`/viewComment/${commentId}`);
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
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

        {/* Comment Cards */}
        <main className="model-cards-container">
          {isLoading ? (
            <div className="loading">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="no-comments">No comments found</div>
          ) : (
            comments.map((comment, index) => (
              <div 
                key={comment.comment_id} 
                className="model-card" 
                onDoubleClick={() => handleDoubleClick(comment.comment_id)}
              >
                <div className="model-info">
                  <span className="model-number">{index + 1}.</span>
                  <div>
                    <div className="model-name">
                      User: {comment.username}
                    </div>
                    <div className="model-updated">
                      Commented at: {comment.created_at}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {comments.length > 0 && (
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
          )}
        </main>
      </div>
    </div>
  );
}