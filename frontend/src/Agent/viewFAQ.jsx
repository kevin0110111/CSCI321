import './viewFAQ.css';
import comment from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewFAQ() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreating = location.state?.isCreating || false;
  const faqId = location.state?.faqId;
  const agentId = localStorage.getItem('accountId');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '' });

  const [faqData, setFaqData] = useState({
    title: '',
    content: '',
    created_agent_id: null
  });

  // Fetch FAQ data if in edit mode
  useEffect(() => {
    if (!isCreating && faqId) {
      const fetchFAQ = async () => {
        try {
          const response = await axios.get(`https://fyp-backend-a0i8.onrender.com/api/faqs/${faqId}`);
          setFaqData({
            title: response.data.title,
            content: response.data.content,
            created_agent_id: response.data.created_agent_id
          });
        } catch (error) {
          console.error('Error fetching FAQ:', error);
        }
      };
      fetchFAQ();
    }
  }, [faqId, isCreating]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!faqData.title || !faqData.content) {
      setResponseBox({ show: true, message: 'Title and content are required!' });
      return;
    }

    try {
      await axios.post('https://fyp-backend-a0i8.onrender.com/api/faqs/', {
        title: faqData.title,
        content: faqData.content,
        created_agent_id: agentId
      });
      setResponseBox({ show: true, message: 'FAQ created successfully!' });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      setResponseBox({ show: true, message: 'Failed to create FAQ' });
    }
  };

  const handleUpdate = async () => {
    if (!faqData.title || !faqData.content) {
      setResponseBox({ show: true, message: 'Title and content are required!' });
      return;
    }

    try {
      await axios.put(`https://fyp-backend-a0i8.onrender.com/api/faqs/${faqId}`, {
        title: faqData.title,
        content: faqData.content
      });
      setResponseBox({ show: true, message: 'FAQ updated successfully!' });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      setResponseBox({ show: true, message: 'Failed to update FAQ' });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://fyp-backend-a0i8.onrender.com/api/faqs/${faqId}`);
      setResponseBox({ show: true, message: 'FAQ deleted successfully!' });
    } catch (err) {
      console.error('Error deleting comment:', err);
      setResponseBox({ show: true, message: 'Failed to delete FAQ' });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
    if (responseBox.message === 'FAQ created successfully!' || responseBox.message === 'FAQ updated successfully!' || responseBox.message === 'FAQ deleted successfully!') {
      navigate('/agentFAQ');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
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

        {/* FAQ Form */}
        <main className="comment-container">
          <div className="user-info">
            <h2>FAQ Title:</h2>
            <textarea
              name="title"
              value={faqData.title}
              onChange={handleInputChange}
              placeholder="Type your title here..."
              className="FAQTitle-box"
            />
          </div>

          <div className="reply-section">
            <h3>Content:</h3>
            <textarea
              name="content"
              value={faqData.content}
              onChange={handleInputChange}
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
                <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
              </>
            )}
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
          </div>

          {showDeleteConfirm && (
            <div className="delfaq-confirmation-overlay">
              <div className="delfaq-confirmation-box">
                <p>Are you sure you want to delete this FAQ?</p>
                <button onClick={confirmDelete} className="delfaq-yes-button">Yes</button>
                <button onClick={cancelDelete} className="delfaq-no-button">No</button>
              </div>
            </div>
          )}

          {responseBox.show && (
            <div className="delfaq-confirmation-overlay">
              <div className="delfaq-confirmation-box">
                <p>{responseBox.message}</p>
                <button onClick={closeResponseBox} className="delfaq-yes-button">Ok</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}