import './LeaveComment.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserComment() {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5); 
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const maxLength = 250;
  const userId = localStorage.getItem('accountId');

  const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_API_URL}/comments`, {
        content: comment,
        rating: rating, 
        is_anonymous: false,
        user_id: parseInt(userId)
      });

      if (response.status === 200) {
        setSubmitted(true);
        setComment('');
        setRating(5);
      }
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    }
  };

  const handleCancel = () => {
    navigate("/user/comments");
    setComment('');
    setRating(5);
    setSubmitted(false);
    setError(null);
  };

  useEffect(() => {
    document.title = 'Write Comment';
  }, []);

  return (
    <div className="leave-comment-container">
      <main className="dashboard-content">
        <form className="comment-form" onSubmit={handleSubmit}>
          <h2 className="comment-title">Leave a Comment</h2>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>
            Please rate and comment our product!
          </p>
          <div className="rating-select" style={{ marginBottom: '1rem' }}>
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: 'pointer',
                  color: star <= rating ? '#FFA500' : '#ccc',
                  fontSize: '1.5em',
                  marginRight: 4
                }}
                onClick={() => setRating(star)}
                data-testid={`star-${star}`}
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: 8, fontSize: '1em', color: '#555' }}>{rating} / 5</span>
          </div>
          <textarea
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) setComment(e.target.value);
            }}
          />
          <div className="char-count">
            {maxLength - comment.length} characters remaining
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="comment-actions">
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit">Submit Comment</button>
          </div>
          {submitted && <div className="thank-you">Thank you for your feedback!</div>}
        </form>
      </main>
    </div>
  );
}