import React from 'react';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';
import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';

const modifier = togglePoint(TOGGLE_POINTS.ROUTES_NOT_PRODUCTION_READY);

const infoLinks = ['contact', ...modifier(['about', 'faq', 'conditions'])];

const WwwFooterLinks = () => (
  <div className="www-footer-links">
    <div className="links">
      <div className="list">
        <h3>
          <T id="WwwFooterLinks.info" />
        </h3>
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
