// UserComments.jsx
import './UserComments.css';
import userIcon from '../assets/logo.png'; 
import { useState, useEffect } from 'react';

export default function UserComments() {
  const [visibleCount, setVisibleCount] = useState(3);


  const allComments = [
    {
      id: 1,
      username: 'Username',
      content: 'Great feature set, but UI can be improved.',
      time: '2024-06-03 09:15 AM',
    },
    {
      id: 2,
      username: 'Username',
      content: 'Detection results are accurate and fast!',
      time: '2024-06-02 16:47 PM',
    },
    {
      id: 3,
      username: 'Username',
      content: 'Helpful app',
      time: '2024-06-01 21:10 PM',
    },
    {
      id: 4,
      username: 'Username',
      content: 'Really nice experience.',
      time: '2024-05-30 18:20 PM',
    },
    {
      id: 5,
      username: 'Username',
      content: 'I like the language switch feature.',
      time: '2024-05-29 13:45 PM',
    }
  ];

  const visibleComments = allComments.slice(0, visibleCount);

  useEffect(() => {
    document.title = 'View Comments';
  }, []);

  return (
        <main className="dashboard-content">
          <div className="comments-container">
            <h2>User Comments</h2>
            <hr />
            {visibleComments.map(comment => (
              <div className="comment-item" key={comment.id}>
                <img src={userIcon} alt="User" className="comment-avatar" />
                <div className="comment-content">
                  <strong>{comment.username}</strong>
                  <p>{comment.content}</p>
                  <span className="comment-time">{comment.time}</span>
                </div>
              </div>
            ))}
            {visibleCount < allComments.length && (
              <div className="load-more">
                <button onClick={() => setVisibleCount(visibleCount + 3)}>Load More</button>
              </div>
            )}
          </div>
        </main>
  );
}
