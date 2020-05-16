import React, { useEffect, useState } from 'react';
import { navigate, useStaticQuery, graphql } from 'gatsby';
import { RichText } from 'prismic-reactjs';
import { Helmet } from 'react-helmet';
import TopNav from '../TopNav';
import Footer from '../Footer';
import LanguageContext from '../../contexts/LanguageContext';
import {
  getLanguageData,
  getShortLang,
  getLongLang,
} from '../../utils/languages.js';
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
  const pageTitle =
    typeof pageName === 'object' ? RichText.asText(pageName) : pageName;
  const pageLang = getShortLang(pageContext.lang);
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

  // Load the Prismic edit button
  if (typeof window !== 'undefined' && window.prismic) {
    window.prismic.setupEditButton();
  }

  return (
    <>
      <LanguageContext.Provider value={[language, setLanguage]}>
        <Helmet>
          <html lang={pageLang} />
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
