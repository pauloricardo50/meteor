import './Footer.scss';

import React, { useContext } from 'react';

import LanguageContext from '../../contexts/LanguageContext';
import LanguagePicker from '../LanguagePicker';
import NewsletterSignup from '../NewsletterSignup';
import FooterContact from './FooterContact';
import FooterMenu from './FooterMenu';
import FooterNotices from './FooterNotices';

const Footer = () => {
  const [language] = useContext(LanguageContext);

  return (
    <>
      <div className="footer-fill" />
      <footer className="footer container">
        <div className="footer-top">
          <FooterMenu />
          <FooterContact language={language} />
        </div>

        <div className="footer-bottom">
          <FooterNotices language={language} />
          {/* <LanguagePicker /> */}
        </div>
      </footer>
    </>
  );
};

export default Footer;
