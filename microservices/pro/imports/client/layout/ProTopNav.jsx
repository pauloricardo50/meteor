// @flow
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Link from 'core/components/Link';

import { ROLES } from 'core/api/constants';
import TopNavLogo from 'core/components/TopNav/TopNavLogo';
import T from 'core/components/Translation';
import * as PRO_ROUTES from '../../startup/client/proRoutes';

type ProTopNavProps = {
  currentUser: Object,
};

const links = currentUser => [
  { id: 'dashboard', link: PRO_ROUTES.PRO_DASHBOARD_PAGE },
  { id: 'account', link: PRO_ROUTES.ACCOUNT_PAGE },
  {
    id: 'logout',
    link: PRO_ROUTES.PRO_DASHBOARD_PAGE,
    handleClick: Meteor.logout,
  },
  ...(Roles.userIsInRole(currentUser, ROLES.DEV)
    ? [{ id: 'dev', link: PRO_ROUTES.DEV_PAGE }]
    : []),
];

const ProTopNav = ({ currentUser }: ProTopNavProps) => (
  <Toolbar className="pro-top-nav">
    <div className="right">
      <TopNavLogo />
    </div>
    {currentUser && (
      <div className="left">
        {links(currentUser).map(({ id, link, handleClick }) => (
          <Link
            to={link}
            className="pro-top-nav-link"
            key={id}
            role="button"
            onClick={handleClick || null}
          >
            <T id={`ProTopNav.${id}`} />
          </Link>
        ))}
      </div>
    )}
  </Toolbar>
);

export default ProTopNav;
