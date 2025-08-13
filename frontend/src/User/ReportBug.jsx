import './ReportBug.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBug } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ReportBug() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || description.trim() === '') {
      setError(t('titleDescriptionEmpty'));
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
      setError(t('submissionFailed'));
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
    document.title = t('reportBugTitle');;
  }, [t]);

  return (
    <main className="dashboard-content">
      <form className="bug-form" onSubmit={handleSubmit}>
        <h2 className="bug-title">
          <FaBug style={{ color: '#e53935', marginRight: 8 }} /> {t('reportABug')}
        </h2>

        <label>{t('bugTitleLabel')}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>{t('descriptionLabel')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <div className="bug-actions">
          <button type="button" onClick={handleReset}>{t('cancel')}</button>
          <button type="submit">{t('submitBugReport')}</button>
        </div>

        {submitted && (
          <div className="bug-success">{t('bugReportSubmitted')}</div>
        )}
      </form>
    </main>
  );
}