import './agentFAQ.css';
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

export default function AgentFAQ() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const faqsPerPage = 5;

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://fyp-backend-a0i8.onrender.com/api/faqs/`, {
          params: {
            skip: (currentPage - 1) * faqsPerPage,
            limit: faqsPerPage
          }
        });

        // Format the date and prepare FAQs data
        const formattedFAQs = response.data.map(faq => ({
          ...faq,
          created_at: formatDate(faq.created_at),
          last_updated: faq.last_updated ? formatDate(faq.last_updated) : formatDate(faq.created_at)
        }));

        setFaqs(formattedFAQs);
        
        // Get total count for pagination
        const countResponse = await axios.get('https://fyp-backend-a0i8.onrender.com/api/faqs/count');
        setTotalPages(Math.ceil(countResponse.data.total / faqsPerPage));
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
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

  const handleDoubleClick = (faqId) => {
    navigate('/viewFAQ', { state: { isCreating: false, faqId } });
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  const handleDashboardCreate = () => {
    navigate('/viewFAQ', { state: { isCreating: true } });
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
            <Link to="/agentComment" className="nav-link"><img src={comment} alt="Comment" className="icon"/> Comment</Link>
            <Link to="/agentBugReport" className="nav-link"><img src={reportBug} alt="ReportedBug" className="icon"/> Reported Bug</Link>
            <Link to="/agentFAQ" className="nav-link active"><img src={faq} alt="FAQ" className="icon"/> FAQ</Link>
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
          <h1>Dashboard - FAQ</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* FAQ Cards */}
        <main className="model-cards-container">
          {isLoading ? (
            <div className="loading">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="no-faqs">No FAQs found</div>
          ) : (
            faqs.map((faq, index) => (
              <div 
                key={faq.faq_id} 
                className="model-card" 
                onDoubleClick={() => handleDoubleClick(faq.faq_id)}
              >
                <div className="model-info">
                  <span className="model-number">{index + 1}.</span>
                  <div>
                    <div className="model-name">FAQ Title: {faq.title}</div>
                    <div className="model-updated">
                      Updated at: {faq.last_updated}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button 
              onClick={handlePrevious} 
              disabled={currentPage === 1 || isLoading}
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
              disabled={currentPage === totalPages || isLoading}
              className="pagination-button"
              aria-label="Next"
            >
              <img src={nextIcon} alt="Next" className="pagination-icon" />
            </button>
            
            <button 
              onClick={handleDashboardCreate}
              className="update-button"
            >
              Create
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}