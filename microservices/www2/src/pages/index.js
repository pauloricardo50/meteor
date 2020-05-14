/* eslint-disable react/jsx-filename-extension */
import { useEffect } from 'react';
import { navigate } from 'gatsby';
import { getLanguageData, getShortLang } from '../utils/languages.js';

const Index = () => {
  useEffect(() => {
    // TODO: first check to see if lang cookie has been set for *.e-potek.ch
    const language =
      typeof navigator === `undefined`
        ? 'fr'
        : getShortLang(navigator.language);

    navigate(getLanguageData(language).homeLink);
  }, []);

  return null;
};

export default Index;
