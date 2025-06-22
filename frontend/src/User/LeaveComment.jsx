// UserComment.jsx
import './LeaveComment.css';
import React, { useState, useEffect } from 'react';

export default function UserComment() {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const maxLength = 250;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      alert('Comment cannot be empty.');
      return;
    }
    console.log('Submitted Comment:', comment);
    setSubmitted(true);
  };
  

  const handleCancel = () => {
    setComment('');
    setSubmitted(false);
  };

  useEffect(() => {
      document.title = 'Write Comment';
    }, []);

  return (
        <div className="leave-comment-container">
          <main className="dashboard-content">
            <form className="comment-form" onSubmit={handleSubmit}>
              <h2 className="comment-title">Leave a Comment</h2>
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
