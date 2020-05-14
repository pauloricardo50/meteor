import React, { useContext } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguages, getLanguageData } from '../../utils/languages.js';
import './LanguagePicker.scss';

const LanguagePicker = () => {
  const [language, setLanguage] = useContext(LanguageContext);

  const languages = getLanguages();

  const languageData = languages.map(lang => getLanguageData(lang));

  return (
    <div className="language-picker">
      {languageData.map(lang => (
        <span
          key={lang.shortLang}
          className="language-option"
          onClick={() => setLanguage(lang.shortLang)}
          data-active={language === lang.shortLang}
        >
          {lang.display}
        </span>
      ))}
    </div>
  );
};

export default LanguagePicker;
