// FAQHelp.jsx
import React, { useState, useEffect } from 'react';
import './FAQHelp.css';

const BASE_API_URL = 'http://localhost:8000/api';  

const FAQHelp = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Failed to load FAQs. Please check if the backend server is running or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faq-layout">
      <main className="faq-main">
        <h1>FAQ / Help Document</h1>
        <input
          type="text"
          placeholder="Search help topics..."
          className="faq-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading ? (
          <p>Loading FAQs...</p>
        ) : error ? (
          <div>
            <p className="error" style={{ color: 'red' }}>{error}</p>
            <button onClick={fetchFAQs} style={{ marginTop: '10px', padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaqs.length === 0 ? (
              <p>No FAQs found matching your search. {faqs.length === 0 && 'No FAQs available in the database.'}</p>
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
        <p className="faq-footer">Still need help? Contact support</p>
      </main>
    </div>
  );
};

export default FAQHelp;