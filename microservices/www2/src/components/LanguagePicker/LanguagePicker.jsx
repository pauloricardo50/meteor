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
      {languageData.map(({ display, shortLang }) => (
        <span
          key={shortLang}
          className="language-option"
          onClick={() => setLanguage(shortLang)}
          data-active={language === shortLang}
        >
          {display}
        </span>
      ))}
    </div>
  );
};

export default LanguagePicker;
