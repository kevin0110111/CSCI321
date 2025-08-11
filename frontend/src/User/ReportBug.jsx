import './ReportBug.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReportBug() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') {
      setError('Title and description cannot be empty.');
      return;
    }

    try {
      const userId = localStorage.getItem('accountId');
      const response = await axios.post(`${BASE_API_URL}/bugreports`, {
        title,
        description,
        user_id: parseInt(userId)
      });

      if (response.status === 200) {
        setSubmitted(true);
        setTitle('');
        setDescription('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to submit bug report. Please try again.');
      console.error('Error submitting bug report:', err);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setSubmitted(false);
    setError(null);
  };

  useEffect(() => {
    document.title = 'Report BUG';
  }, []);

  return (
    <main className="dashboard-content">
      <form className="bug-form" onSubmit={handleSubmit}>
        <h2 className="bug-title">🐞 Report a Bug</h2>

        <label>Bug Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <div className="bug-actions">
          <button type="button" onClick={handleReset}>Cancel</button>
          <button type="submit">Submit Bug Report</button>
        </div>

        {submitted && (
          <div className="bug-success">Bug report submitted successfully</div>
        )}
      </form>
    </main>
  );
}