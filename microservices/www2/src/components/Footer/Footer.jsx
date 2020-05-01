import React from 'react';
import epotekLogo from '../../images/epotek_logo.png';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="container">
      <p>
        <a href="/" rel="noopener noreferrer">
          <img
            className="footer-logo"
            src={epotekLogo}
            alt="e-Potek blue logo"
          />
        </a>
      </p>
    </footer>
  );
};

export default Footer;
