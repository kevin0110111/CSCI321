// FAQHelp.jsx
import React, { useState } from 'react';

import './FAQHelp.css';

const faqs = [
  {
    question: 'How do I upload my crop image?',
    answer: 'To upload, click the “Upload Image” button on the dashboard, then select a file from your device.',
  },
  {
    question: 'What is the monthly quota limit?',
    answer: 'For free users, the monthly quota is set at 30 images.',
  },
  {
    question: 'Can I manually edit annotation labels?',
    answer: 'Currently, only premium users can re-annotate manually.',
  },
  {
    question: 'How can I reset my password?',
    answer: 'You can reset your password from the login page or account settings.',
  },
];

const FAQHelp = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-layout">
      <main className="faq-main">
        <h1>FAQ / Help Document</h1>
        <input type="text" placeholder="Search help topics..." className="faq-search" />
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
              </button>
              {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
            </div>
          ))}
        </div>
        <p className="faq-footer">Still need help? Contact support</p>
      </main>
    </div>
  );
};

export default FAQHelp;

