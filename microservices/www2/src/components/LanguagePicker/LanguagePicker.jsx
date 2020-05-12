import React, { useContext } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import './LanguagePicker.scss';

const LanguagePicker = () => {
  const [language, setLanguage] = useContext(LanguageContext);

  return (
    <div className="language-picker">
      <span
        className="language-option"
        onClick={() => setLanguage('fr')}
        data-active={language === 'fr'}
      >
        FR
      </span>
      <span
        className="language-option"
        onClick={() => setLanguage('en')}
        data-active={language === 'en'}
      >
        EN
      </span>
    </div>
  );
};

export default LanguagePicker;
