import React from 'react';

import { Link } from 'react-router-dom';
import { T } from 'core/components/Translation';

const infoLinks = ['faq', 'contact', 'conditions'];

const WwwFooterLinks = () => (
  <div className="www-footer-links">
    <div className="links">
      <div className="list">
        <h4>
          <T id="WwwFooterLinks.info" />
        </h4>
        {infoLinks.map(link => (
          <Link key={link} to={`/${link}`}>
            <T id={`WwwFooterLinks.${link}`} />
          </Link>
        ))}
      </div>
    </div>
    <div className="company">
      <p>
        e-Potek SA est une société soumise aux règles imposées par la FINMA
        (organe suprême de contrôle du système financier Suisse).
      </p>
    </div>
  </div>
);

export default WwwFooterLinks;
