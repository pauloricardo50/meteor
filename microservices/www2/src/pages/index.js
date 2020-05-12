/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const getHomeLink = () => {
  const homeLinkMap = {
    fr: '/fr/accueil',
    en: '/en/home',
  };

  const shortLang = (language) => language.split('-')[0].toLowerCase();

  // TODO: first check to see if lang cookie has been set for *.e-potek.ch

  // check if window.navigator exists
  if (typeof navigator === `undefined`) {
    return homeLinkMap.fr;
  }

  // get user's language from the browser
  const language = shortLang(navigator.language);

  return homeLinkMap[language] || homeLinkMap.fr;
};

const Index = () => {
  useEffect(() => {
    const homeLink = getHomeLink();

    navigate(`/${homeLink}`);
  }, []);

  return null;
};

export default Index;
