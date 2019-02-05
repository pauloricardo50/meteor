import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';

import T from 'core/components/Translation';

export const links = [
  'about',
  'interests',
  'faq',
  'careers',
  'blog',
  'contact',
];

const WwwTopNavLinksList = ({ variant }) => (
  <React.Fragment>
    {links.map(link => (
      <Link
        key={link}
        to={`/${link}`}
        className={`www-top-nav-link ${variant}`}
      >
        <h5 className="www-top-nav-link-label">
          <T id={`WwwTopNavLinks.${link}`} />
        </h5>
      </Link>
    ))}
    <span className="divider" />
    <a
      href={Meteor.settings.public.subdomains.app}
      className={`www-top-nav-link ${variant}`}
    >
      <h5 className="www-top-nav-link-label">
        <T id="WwwTopNavLinks.login" />
      </h5>
    </a>
  </React.Fragment>
);

WwwTopNavLinksList.propTypes = {
  variant: PropTypes.string,
};

WwwTopNavLinksList.defaultProps = {
  variant: '',
};

export default WwwTopNavLinksList;
