/* eslint-disable react/jsx-filename-extension */
import { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useCookies } from 'react-cookie';

import {
  getLanguageData,
  getLanguages,
  getShortLang,
} from '../utils/languages.js';

const Index = () => {
  const [cookies] = useCookies(['epLang']);

  useEffect(() => {
    const languages = getLanguages();
    let language = 'fr';

    if (cookies && languages.includes(cookies.epLang)) {
      language = cookies.epLang;
    } else if (typeof navigator !== 'undefined') {
      language = getShortLang(navigator.language);
    }

    navigate(getLanguageData(language).homeLink);
  }, []);

  return null;
};

export default Index;
