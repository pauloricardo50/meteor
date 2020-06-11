import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import DropdownMenu from 'core/components/DropdownMenu';
import Link from 'core/components/Link';
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
    <>
      {links.map(link => (
        <Link
          key={link}
          to={`/${link}`}
          className={`www-top-nav-link ${variant}`}
        >
          <Button className="www-top-nav-link-label" primary>
            <T id={`WwwTopNavLinks.${link}`} />
          </Button>
        </Link>
      ))}
      <span className="divider" />
      <DropdownMenu
        className={`www-top-nav-link ${variant}`}
        renderTrigger={({ handleOpen }) => (
          <Button
            className="www-top-nav-link-label"
            primary
            onClick={handleOpen}
          >
            <T id="WwwTopNavLinks.login" />
          </Button>
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
    </>
  );
};

WwwTopNavLinksList.propTypes = {
  variant: PropTypes.string,
};

WwwTopNavLinksList.defaultProps = {
  variant: '',
};

export default WwwTopNavLinksList;
