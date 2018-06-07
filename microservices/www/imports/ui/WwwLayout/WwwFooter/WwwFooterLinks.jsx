import React from 'react';
import { Link } from 'react-router-dom';

import T from 'core/components/Translation';

const infoLinks = ['about', 'interests', 'faq', 'careers', 'contact'];

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
        <T id="WwwFooterLinks.company" />
      </p>
    </div>
  </div>
);

export default WwwFooterLinks;
