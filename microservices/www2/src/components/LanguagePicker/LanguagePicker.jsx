import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguages, getLanguageData } from '../../utils/languages.js';
import './LanguagePicker.scss';

const LanguagePicker = () => {
  const [cookies, setCookie] = useCookies(['epLang']);
  const [language, setLanguage] = useContext(LanguageContext);
  const languages = getLanguages();
  const languageData = languages.map(lang => getLanguageData(lang));

  return (
    <div className="language-picker">
      {languageData.map(({ display, shortLang }) => (
        <div
          key={shortLang}
          className="language-option"
          onClick={() => {
            setCookie('epLang', shortLang, {
              maxAge: '31536000', // one year
              domain: 'e-potek.ch',
            });
            setLanguage(shortLang);
          }}
          data-active={language === shortLang}
        >
          {display}
        </div>
      ))}
    </div>
  );
};

export default LanguagePicker;
