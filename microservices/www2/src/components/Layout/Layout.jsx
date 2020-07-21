import '../../styles/main.scss';

import React, { useEffect, useState } from 'react';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet';

import LanguageContext from '../../contexts/LanguageContext';
import useIntercom from '../../hooks/useIntercom';
import epotekLogo from '../../images/epotek_logo.png';
import {
  getLanguageData,
  getLongLang,
  getShortLang,
} from '../../utils/languages.js';
import { linkResolver } from '../../utils/linkResolver';
import { useTracking } from '../../utils/tracking';
import CookiesNotification from '../CookiesNotification';
import Footer from '../Footer';
import TopNav from '../TopNav';
import { LayoutContext } from './LayoutContext';

const Layout = ({ children, location, pageContext, data }) => {
  const siteData = useStaticQuery(graphql`
    query SiteQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);
  const pageObject = data?.prismic?.page || data?.prismic?.post;

  useTracking(pageObject?.tracking_id);
  useIntercom();

  const { title, description } = siteData.site.siteMetadata;
  const pageTitle = pageObject.name?.[0]?.text || pageObject.title?.[0]?.text;

  // const pageLang = getShortLang(pageContext.lang);
  const pageLang = getShortLang('fr-ch');
  const pageType = pageContext.type;

  const [language, setLanguage] = useState(pageLang);

  useEffect(() => {
    if (language !== pageLang) {
      const newLanguage = getLongLang(language);
      const altPage = pageContext.alternateLanguages.find(
        alternateLanguage => alternateLanguage.lang === newLanguage,
      );

      if (altPage) {
        navigate(linkResolver(altPage));
      } else if (pageType === 'post') {
        navigate(getLanguageData(language).blogLink);
      } else {
        navigate(getLanguageData(language).homeLink);
      }
    }
  }, [language]);

  return (
    <LayoutContext.Provider value={pageObject}>
      <LanguageContext.Provider value={[language, setLanguage]}>
        <Helmet>
          <html lang={pageLang} />
          <title>{`${title}${pageTitle ? ` | ${pageTitle}` : ''}`}</title>
          <meta name="description" content={description} />
          <meta name="og:title" content={pageTitle} />
          <meta name="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={title} />
          <meta property="og:locale" content={pageContext.lang} />
          <meta property="og:image" content={epotekLogo} />
          {location && <meta property="og:url" content={location.href} />}
        </Helmet>

        <TopNav />

        <main>{children}</main>

        <Footer />

        <CookiesNotification />
      </LanguageContext.Provider>
    </LayoutContext.Provider>
  );
};

export default Layout;
