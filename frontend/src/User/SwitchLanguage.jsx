// SwitchLanguage.jsx
import './SwitchLanguage.css';
import { useState, useEffect } from 'react';

export default function SwitchLanguage() {
  const [selectedLang, setSelectedLang] = useState('');

  const handleSelectLanguage = (langLabel) => {
    setSelectedLang(langLabel);

  };

  useEffect(() => {
    document.title = 'Switch Lang';
  }, []);

  return (
        <main className="dashboard-content">
          <div className="language-container">
            <h2>Switch Language</h2>
            <p>Please select your language:</p>
            <div className="language-options">
              <button onClick={() => handleSelectLanguage('English')}>English</button>
              <button onClick={() => handleSelectLanguage('中文（简体）')}>中文</button>
            </div>
            {selectedLang && (
              <div className="lang-confirm">
                Language changed to {selectedLang}
              </div>
            )}
          </div>
        </main>
  );
}
