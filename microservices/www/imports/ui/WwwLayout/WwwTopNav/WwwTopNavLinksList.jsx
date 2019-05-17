import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';
import DropdownMenu from 'core/components/DropdownMenu';

import T from 'core/components/Translation';

export const links = [
  '',
  'about',
  'interests',
  'faq',
  'careers',
  'blog',
  'contact',
];

const WwwTopNavLinksList = ({ variant }) => {
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  return (
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
      <DropdownMenu
        className={`www-top-nav-link ${variant}`}
        renderTrigger={({ handleOpen }) => (
          <h5 className="www-top-nav-link-label" onClick={handleOpen}>
            <T id="WwwTopNavLinks.login" />
          </h5>
        )}
        options={[
          {
            id: 'appLogin',
            label: <T id="WwwTopNavLinks.appLogin" />,
            onClick: () => {
              window.location.href = Meteor.settings.public.subdomains.app;
            },
          },
          {
            id: 'proLogin',
            label: <T id="WwwTopNavLinks.proLogin" />,
            onClick: () => {
              window.location.href = Meteor.settings.public.subdomains.pro;
            },
          },
        ]}
      />
    </React.Fragment>
  );
};

WwwTopNavLinksList.propTypes = {
  variant: PropTypes.string,
};

WwwTopNavLinksList.defaultProps = {
  variant: '',
};

export default WwwTopNavLinksList;
