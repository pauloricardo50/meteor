// @flow
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import { Link } from 'react-router-dom';

import TopNavLogo from 'core/components/TopNav/TopNavLogo';
import T from 'core/components/Translation';
import * as PRO_ROUTES from '../../startup/client/proRoutes';

type ProTopNavProps = {};

const links = [
  { id: 'dashboard', link: PRO_ROUTES.PRO_DASHBOARD_PAGE },
  { id: 'account', link: PRO_ROUTES.ACCOUNT_PAGE },
];

const ProTopNav = (props: ProTopNavProps) => (
  <Toolbar className="pro-top-nav">
    <div className="right">
      <TopNavLogo />
    </div>
    <div className="left">
      {links.map(({ id, link }) => (
        <Link to={link} className="pro-top-nav-link" key={id} role="button">
          <T id={`ProTopNav.${id}`} />
        </Link>
      ))}
    </div>
  </Toolbar>
);

export default ProTopNav;
