import { useState } from 'react';

export default function TEDHeader({ onLanguageChange }) {
  const [language, setLanguage] = useState('bilingual');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <div className="ted-header">
      <div>
        <div className="ted-logo">TED</div>
        <h1 className="ted-title">English Learning Material</h1>
        <p className="ted-subtitle">AI-Generated Educational Content</p>
      </div>

      <div className="language-toggle">
        <button
          className={language === 'bilingual' ? 'active' : ''}
          onClick={() => handleLanguageChange('bilingual')}
        >
          双语
        </button>
        <button
          className={language === 'english' ? 'active' : ''}
          onClick={() => handleLanguageChange('english')}
        >
          English
        </button>
        <button
          className={language === 'chinese' ? 'active' : ''}
          onClick={() => handleLanguageChange('chinese')}
        >
          中文
        </button>
      </div>
    </div>
  );
}
