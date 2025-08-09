// UserComments.jsx
import './userComments.css';
import userIcon from '../assets/logo.png'; 
import { useState, useEffect } from 'react';
import axios from 'axios';  // 新增：引入 axios 用于 API 调用

const BASE_API_URL = 'http://localhost:8000/api';  // 新增：统一 API base URL，便于维护

export default function UserComments() {
  const [comments, setComments] = useState([]);  // 新增：存储从后端加载的评论数据
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);  // 新增：加载状态
  const [error, setError] = useState(null);  // 新增：错误状态

  useEffect(() => {
    document.title = 'View Comments';

    // 新增：从后端加载评论数据
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');  // 新增：支持认证 token
        const response = await axios.get(`${BASE_API_URL}/comments/`, {  // 假设端点是 /api/comments/，根据您的 routers/comments.py 调整
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        // 假设后端返回数组，如 [{ id, username, content, time: '2024-06-03T09:15:00' }]
        setComments(response.data.map(comment => ({
          id: comment.id,
          username: comment.username || 'Anonymous',  // fallback 如果无 username
          content: comment.content,
          time: formatTime(comment.time),  // 新增：格式化时间
        })));
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  // 新增：时间格式化函数（假设后端是 ISO 字符串，转换为 'YYYY-MM-DD HH:MM AM/PM'）
  const formatTime = (isoTime) => {
    if (!isoTime) return 'Unknown time';
    const date = new Date(isoTime);
    return date.toLocaleString('en-US', { 
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true 
    });
  };

  const visibleComments = comments.slice(0, visibleCount);

  return (
    <main className="dashboard-content">
      <div className="comments-container">
        <h2>User Comments</h2>
        <hr />
        {isLoading ? (
          <p>Loading comments...</p>  // 新增：加载提示
        ) : error ? (
          <p className="error" style={{ color: 'red' }}>{error}</p>  // 新增：错误显示
        ) : comments.length === 0 ? (
          <p>No comments available.</p>  // 新增：空数据提示
        ) : (
          <>
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
            {visibleCount < comments.length && (
              <div className="load-more">
                <button onClick={() => setVisibleCount(visibleCount + 3)}>Load More</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}