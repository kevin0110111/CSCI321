// SwitchLanguage.jsx
import './switchLanguage.css';
import { useState, useEffect } from 'react';

export default function SwitchLanguage() {
  const [selectedLang, setSelectedLang] = useState('');

  const handleSelectLanguage = (langLabel) => {
    setSelectedLang(langLabel);
    // 可选：你可以在这里使用 i18n 切换语言
    // i18n.changeLanguage(langCode)
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
              <button onClick={() => handleSelectLanguage('Español')}>Español</button>
              <button onClick={() => handleSelectLanguage('Français')}>Français</button>
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
