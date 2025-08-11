// UserComments.jsx
import './UserComments.css';
import userIcon from '../assets/logo.png'; 
import { useState, useEffect } from 'react';
import axios from 'axios';  

const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';  

export default function UserComments() {
  const [comments, setComments] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalComments, setTotalComments] = useState(0);  
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const commentsPerPage = 3;  
  const [hasMore, setHasMore] = useState(true);  

  useEffect(() => {
    document.title = 'View Comments';
    loadMoreComments();  
  }, []);  

  // Function to load more comments with pagination
  const loadMoreComments = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');  
      // Fetch comments with skip and limit for pagination
      const response = await axios.get(`${BASE_API_URL}/comments/`, {  
        params: {
          skip: (currentPage - 1) * commentsPerPage,
          limit: commentsPerPage
        },
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      
      // Format comments, assuming backend returns [{ comment_id, user: {username}, content, created_at }]
      const formattedComments = response.data.map(comment => ({
        id: comment.comment_id,
        username: comment.user?.username || 'Anonymous',  
        content: comment.content,
        time: formatDate(comment.created_at),  
      }));
      
      setComments(prevComments => [...prevComments, ...formattedComments]);  
      
      // If this is the first load, also fetch total count
      if (currentPage === 1) {
        const countResponse = await axios.get(`${BASE_API_URL}/comments/count`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        setTotalComments(countResponse.data.total);
      }
      
      // Update page and check if there are more comments
      setCurrentPage(prevPage => prevPage + 1);
      if (comments.length + formattedComments.length >= totalComments) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <main className="dashboard-content">
      <div className="comments-container">
        <h2>User Comments</h2>
        <hr />
        {isLoading && comments.length === 0 ? (
          <p>Loading comments...</p>  
        ) : error ? (
          <p className="error" style={{ color: 'red' }}>{error}</p>  
        ) : comments.length === 0 ? (
          <p>No comments available.</p>  
        ) : (
          <>
            {comments.map(comment => (
              <div className="comment-item" key={comment.id}>
                <img src={userIcon} alt="User" className="comment-avatar" />
                <div className="comment-content">
                  <strong>{comment.username}</strong>
                  <p>{comment.content}</p>
                  <span className="comment-time">{comment.time}</span>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="load-more">
                <button onClick={loadMoreComments} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}