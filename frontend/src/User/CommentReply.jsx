import './CommentReply.css';
import userIcon from '../assets/user.png';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';

export default function CommentReply() {
  const [comment, setComment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { comment_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'View Comment Reply';

    const fetchComment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await axios.get(`${BASE_API_URL}/comments/${comment_id}`);
        setComment({
          id: resp.data.comment_id,
          username: resp.data.user?.username || 'Anonymous',
          content: resp.data.content,
          reply_content: resp.data.reply_content || 'No reply yet',
          replied_agent: resp.data.replied_agent?.username || 'None',
          time: formatDate(resp.data.created_at),
          replied_at: resp.data.replied_at ? formatDate(resp.data.replied_at) : 'Not replied',
        });
      } catch (err) {
        console.error('Error fetching comment:', err);
        setError('Failed to load comment details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComment();
  }, [comment_id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleBack = () => {
    navigate('/user/comments');
  };

  return (
    <main className="dashboard-content">
      <div className="comment-reply-container">
        <h2>Comment Details</h2>
        <hr />
        {isLoading ? (
          <p>Loading comment...</p>
        ) : error ? (
          <p className="error" style={{ color: 'red' }}>{error}</p>
        ) : comment ? (
          <div className="comment-reply">
            <div className="comment-item">
              <img src={userIcon} alt="User" className="comment-avatar" />
              <div className="comment-content">
                <strong>{comment.username}</strong>
                <p>{comment.content}</p>
                <span className="comment-time">Posted: {comment.time}</span>
              </div>
            </div>
            <div className="reply-item">
              <h3>Reply</h3>
              <p>{comment.reply_content}</p>
              <span className="reply-time">
                Replied on {comment.replied_at}
              </span>
            </div>
            <button onClick={handleBack} className="backToComment-button">Back to Comments</button>
          </div>
        ) : (
          <p>No comment found.</p>
        )}
      </div>
    </main>
  );
}