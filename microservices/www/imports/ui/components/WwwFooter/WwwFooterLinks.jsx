import React from 'react';

import { Link } from 'react-router-dom';
import { T } from 'core/components/Translation';

const infoLinks = ['faq', 'contact', 'careers', 'conditions'];

const WwwFooterLinks = () => (
  <div className="page-footer-links">
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
      <h4>e-Potek</h4>
      <p>e-Potek est enregistré au registre du commerce et est agréé FINMA.</p>
    </div>
  </div>
);

export default WwwFooterLinks;
