// SwitchLanguage.jsx
import './SwitchLanguage.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SwitchLanguage() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleSelectLanguage = (lang, langCode) => {
    i18n.changeLanguage(langCode); // Change language
    localStorage.setItem('i18nextLng', langCode);
    setSelectedLang(lang);
  };

  return (
    <main className="dashboard-content">
      <div className="language-container">
        <h2>{t('switchLanguage')}</h2>
        <p>{t('selectLanguage')}</p>
        <div className="language-options">
          <button onClick={() => handleSelectLanguage('English', 'en')}>
            English
          </button>
          <button onClick={() => handleSelectLanguage('中文（简体）', 'zh')}>
            中文
          </button>
        </div>
        {selectedLang && (
          <div className="lang-confirm">
            {t('languageChanged', { lang: selectedLang })}
          </div>
        )}
      </div>
    </main>
  );
}