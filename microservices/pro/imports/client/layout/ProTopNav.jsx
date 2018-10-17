// @flow
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { Link } from 'react-router-dom';

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
        {links(currentUser).map(({ id, link }) => (
          <Link to={link} className="pro-top-nav-link" key={id} role="button">
            <T id={`ProTopNav.${id}`} />
          </Link>
        ))}
      </div>
    )}
  </Toolbar>
);

export default ProTopNav;
