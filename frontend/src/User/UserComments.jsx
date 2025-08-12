import './UserComments.css';
import userIcon from '../assets/user.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Change this to your production endpoint if needed
const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';

export default function UserComments() {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const commentsPerPage = 3;
  const [hasMore, setHasMore] = useState(true);

  // On mount: fetch total count and load first page
  useEffect(() => {
    document.title = 'View Comments';

    let cancelled = false;

    const init = async () => {
      setError(null);
      try {
        setIsLoading(true);
        const countResp = await axios.get(`${BASE_API_URL}/comments/count`);
        if (cancelled) return;

        const total = countResp?.data?.total ?? 0;
        setTotalComments(total);

        if (total === 0) {
          setHasMore(false);
          setComments([]);
        } else {
          // load first page
          await loadComments(1);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching comment count:', err);
          setError('Failed to load comments. Please try again later.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // loadComments: fetch a single page and append (deduplicated)
  const loadComments = async (page = currentPage) => {
    // prevent concurrent loads and avoid loading when no more
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const resp = await axios.get(`${BASE_API_URL}/comments/`, {
        params: {
          skip: (page - 1) * commentsPerPage,
          limit: commentsPerPage,
        },
      });

      const data = Array.isArray(resp.data) ? resp.data : [];

      const formatted = data.map((c) => ({
        id: c.comment_id,
        username: c.user?.username || 'Anonymous',
        content: c.content,
        time: formatDate(c.created_at),
        reply_content: c.reply_content,
        rating: c.rating, 
      }));

      // Append but remove duplicates (by id) in a safe, functional way
      setComments((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = formatted.filter((f) => !existingIds.has(f.id));
        const newAll = [...prev, ...newItems];

        // If server returned no items for this page or no new items -> stop further loads
        if (formatted.length === 0 || newItems.length === 0) {
          setHasMore(false);
        } else if (formatted.length < commentsPerPage) {
          // fewer items than page size means last page
          setHasMore(false);
        } else {
          // Otherwise use the totalComments value to decide
          setHasMore(newAll.length < (totalComments || Infinity));
        }

        return newAll;
      });

      setCurrentPage(page + 1);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDoubleClick = (commentId) => {
    navigate(`/user/comments/${commentId}`);
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
            {comments.map((comment) => (
              <div key={comment.id}>
                <div className="comment-item" onDoubleClick={() => handleDoubleClick(comment.id)}>
                  <img src={userIcon} alt="User" className="comment-avatar" />
                  <div className="comment-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{comment.username}</strong>
                      <span style={{ color: '#FFA500', fontSize: '1.1em' }}>
                        {'★'.repeat(comment.rating)}
                        {'☆'.repeat(5 - comment.rating)}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                    <span className="comment-time">{comment.time}</span>
                    {comment.reply_content && (
                      <div
                        className="agent-reply"
                        style={{
                          marginTop: '8px',
                          background: '#f5f5f5',
                          borderLeft: '3px solid #4CAF50',
                          padding: '8px 12px',
                          borderRadius: '4px',
                        }}
                      >
                        <strong style={{ color: '#4CAF50' }}>Agent Reply:</strong>
                        <div>{comment.reply_content}</div>
                      </div>
                    )}
                  </div>
                </div>
                <hr style={{ margin: '18px 0' }} />
              </div>
            ))}

            <div className="load-more">
              {hasMore && (
                <button onClick={() => loadComments(currentPage)} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              )}
              <button onClick={() => navigate('/user/leaveComment')} className="add-comment">
                Add Comment
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}