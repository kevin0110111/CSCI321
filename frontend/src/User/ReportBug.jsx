// ReportBug.jsx
import './reportBug.css';
import { useState, useEffect } from 'react';

export default function ReportBug() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加真正的提交逻辑，比如 POST 到后端 API
    console.log({ title, description, file });
    setSubmitted(true);
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setSubmitted(false);
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

            <label>Attach Screenshot (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

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
