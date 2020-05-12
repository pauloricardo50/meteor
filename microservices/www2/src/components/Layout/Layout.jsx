import React, { useEffect, useState } from 'react';
import { navigate, useStaticQuery, graphql } from 'gatsby';
import { RichText } from 'prismic-reactjs';
import { Helmet } from 'react-helmet';
import TopNav from '../TopNav';
import Footer from '../Footer';
import LanguageContext from '../../contexts/LanguageContext';
import { linkResolver } from '../../utils/linkResolver';
import '../../styles/main.scss';

const Layout = ({ children, pageContext, pageName }) => {
  const data = useStaticQuery(graphql`
    query SiteQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);

  const { title, description } = data.site.siteMetadata;
  const pageTitle = RichText.asText(pageName);

  const shortLang = {
    'fr-ch': 'fr',
    'en-us': 'en',
  }[pageContext.lang];

  const longLang = {
    fr: 'fr-ch',
    en: 'en-us',
  };

  const [language, setLanguage] = useState(shortLang);

  useEffect(() => {
    if (language !== shortLang) {
      const newLanguage = longLang[language];
      const altPage = pageContext.alternateLanguages.find(
        (alternateLanguage) => alternateLanguage.lang === newLanguage,
      );

      if (altPage) {
        navigate(linkResolver(altPage));
      } else {
        // TODO: if there is no alternate lang page to redirect to (maybe not published), then do what?
        // ... for instance, should we go to blog home if the source page was an article?
        navigate('/');
      }
    }
  }, [language]);

  // Load the Prismic edit button
  if (typeof window !== 'undefined' && window.prismic) {
    window.prismic.setupEditButton();
  }

  return (
    <>
      <LanguageContext.Provider value={[language, setLanguage]}>
        <Helmet>
          <html lang={shortLang} />
          <meta charSet="utf-8" />
          <title>{`${title} | ${pageTitle}`}</title>
          <meta name="description" content={description} />
        </Helmet>

        <TopNav />

        <main>{children}</main>

        <Footer />
      </LanguageContext.Provider>
    </>
  );
};

export default Layout;
