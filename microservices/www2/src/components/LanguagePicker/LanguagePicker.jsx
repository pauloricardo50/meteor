import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguages, getLanguageData } from '../../utils/languages.js';
import './LanguagePicker.scss';

// setCookie('name', newName, { path: '/' });

const LanguagePicker = () => {
  const [cookies, setCookie] = useCookies(['epLang']);
  const [language, setLanguage] = useContext(LanguageContext);
  const languages = getLanguages();
  const languageData = languages.map(lang => getLanguageData(lang));

  return (
    <div className="language-picker">
      {languageData.map(({ display, shortLang }) => (
        <span
          key={shortLang}
          className="language-option"
          onClick={() => {
            setCookie('epLang', shortLang, {
              maxAge: '120',
              domain: 'netlify.app',
            });
            setLanguage(shortLang);
          }}
          data-active={language === shortLang}
        >
          {display}
        </span>
      ))}
    </div>
  );
};

export default LanguagePicker;
