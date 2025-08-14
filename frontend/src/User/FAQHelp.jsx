// FAQHelp.jsx
import React, { useState, useEffect } from 'react';
import './FAQHelp.css';
import { useTranslation } from 'react-i18next';

const BASE_API_URL = 'https://fyp-backend-a0i8.onrender.com/api';  

const FAQHelp = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const fetchFAQs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };

      const response = await fetch(`${BASE_API_URL}/faqs/`, { headers });  
      console.log('FAQ fetch status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch FAQs: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched FAQs:', data);
      setFaqs(data.map(item => ({
        question: item.title,
        answer: item.content,
      })));
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(t('failedToLoadFAQs'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [t]);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faq-layout">
      <main className="faq-main">
        <h1>{t('faqHelpDocument')}</h1>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          className="faq-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading ? (
          <p>{t('loadingFAQs')}</p>
        ) : error ? (
          <div>
            <p className="error" style={{ color: 'red' }}>{error}</p>
            <button onClick={fetchFAQs} style={{ marginTop: '10px', padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {t('retry')}
            </button>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaqs.length === 0 ? (
              <p>{t('noFaqsFound')}{' '} {faqs.length === 0 && t('noFaqsInDatabase')}</p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div key={index} className={`faq-item ${activeIndex === index ? 'expanded' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFAQ(index)}>
                    {faq.question}
                  </button>
                  {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
                </div>
              ))
            )}
          </div>
        )}
        <p className="faq-footer">{t('stillNeedHelp')}
          <a href="mailto:support@example.com">jwang109@mymail.sim.edu.sg</a>
        </p>
      </main>
    </div>
  );
};

export default FAQHelp;