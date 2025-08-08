import './viewComment.css';
import commentt from '../assets/comment.svg';
import reportBug from '../assets/bug.svg';
import faq from '../assets/faq.svg';
import logout from '../assets/logout.svg';
import profile from '../assets/profile.svg';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewComment() {
  const { comment_id } = useParams();
  const navigate = useNavigate();
  const [reply, setReply] = useState('');
  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [responseBox, setResponseBox] = useState({ show: false, message: '' });

  // Get the logged-in agent's ID
  const agentId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://fyp-backend-a0i8.onrender.com/api/comments/${comment_id}`);
        setComment(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch comment');
        console.error('Error fetching comment:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComment();
  }, [comment_id]);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async () => {
    try {
      if (!reply.trim()) {
        setResponseBox({ show: true, message: 'Please enter a reply!' });
        return;
      }

      const agentId = localStorage.getItem('accountId');
      if (!agentId) {
        setResponseBox({ show: true, message: 'Session expired. Please login again.' });
        navigate('/login');
        return;
      }

      setIsLoading(true);
      const response = await axios.post(`https://fyp-backend-a0i8.onrender.com/api/comments/${comment_id}/reply`, {
        reply_content: reply,
        replied_agent_id: parseInt(agentId)
      });

      setComment(response.data);
      setReply('');
      setResponseBox({ show: true, message: 'Reply submitted successfully!' });
    } catch (err) {
      console.error('Reply error:', err);
      setResponseBox({ show: true, message: err.response?.data?.detail || 'Failed to submit reply' });
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://fyp-backend-a0i8.onrender.com/api/comments/${comment_id}`);
      setResponseBox({ show: true, message: 'Comment deleted successfully!' });
    } catch (err) {
      setResponseBox({ show: true, message: 'Failed to delete comment' });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const closeResponseBox = () => {
    setResponseBox({ show: false, message: '' });
    if (responseBox.message === 'Comment deleted successfully!') {
      navigate('/agentComment');
    }
  };

  const handleBack = () => {
    navigate('/agentComment');
  };

  const handleProfileClick = () => {
    navigate('/updateAgentAccount');
  };

  const AgentLogout = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading comment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
        <button onClick={handleBack} className="back-button">Back to Comments</button>
      </div>
    );
  }

  if (!comment) {
    return (
      <div className="dashboard-container">
        <div className="error">Comment not found</div>
        <button onClick={handleBack} className="back-button">Back to Comments</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar remains the same */}
      <aside className="agentsidebar">
        <div className="logo">Agent Portal</div>
        <nav className="sidebar-nav">
          <div>
            <Link to="/agentComment" className="nav-link active">
              <img src={commentt} alt="Comment" className="icon"/> Comment
            </Link>
            <Link to="/agentBugReport" className="nav-link">
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
          <h1>View comment</h1>
          <div className="profile">
            <button onClick={handleProfileClick} className="profile-button">
              <img src={profile} alt="Profile" className="profile-icon" />
            </button>  
          </div>
        </header>

        {/* Comment Section */}
        <main className="comment-container">
          <div className="user-info">
            <h2>User: {comment.user?.username || `User ${comment.user_id}`}</h2>
          </div>

          <div className="comment-section">
            <h3>Comment:</h3>
            <div className="comment-box">
              <p>{comment.content}</p>
            </div>
            <h3>Current reply:</h3>
          </div>

          {comment.reply_content && (
            <div className="comment-box">
              <p>{comment.reply_content}</p>
              <br />
              <p>Replied by Agent {comment.replied_agent_id} on {new Date(comment.replied_at).toLocaleDateString()}</p>
            </div>
          )}

          {!comment.reply_content && (
            <>
              <div className="reply-section">
                <h3>Add Reply:</h3>
                <textarea
                  value={reply}
                  onChange={handleReplyChange}
                  placeholder="Type your reply here..."
                  className="reply-box"
                />
              </div>

              <div className="action-buttons">
                <button className="reply-button" onClick={handleReplySubmit}>Reply</button>
              </div>
            </>
          )}

          <div className="action-buttons">
            <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
            <button className="back-button" onClick={handleBack}>Back</button>
          </div>

          {showDeleteConfirm && (
            <div className="delcom-confirmation-overlay">
              <div className="delcom-confirmation-box">
                <p>Are you sure you want to delete this comment?</p>
                <button onClick={confirmDelete} className="delcom-yes-button">Yes</button>
                <button onClick={cancelDelete} className="delcom-no-button">No</button>
              </div>
            </div>
          )}

          {responseBox.show && (
            <div className="delcom-confirmation-overlay">
              <div className="delcom-confirmation-box">
                <p>{responseBox.message}</p>
                <button onClick={closeResponseBox} className="delcom-yes-button">Ok</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}