// @flow
import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { NavLink } from 'react-router-dom';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { createRoute } from 'core/utils/routerUtils';
import {
  PRO_DASHBOARD_PAGE,
  PRO_ORGANISATION_PAGE,
} from '../../startup/client/proRoutes';

const items = [
  {
    label: <T id="ProSideNav.dashboard" />,
    to: PRO_DASHBOARD_PAGE,
    icon: 'home',
    exact: true,
  },
  {
    label: <T id="ProSideNav.organisation" />,
    to: createRoute(PRO_ORGANISATION_PAGE, { tabId: '' }),
    icon: <FontAwesomeIcon icon={faBriefcase} className="collection-icon" />,
  },
];

type ProSideNavProps = {};

const ProSideNav = (props: ProSideNavProps) => (
  <Drawer variant="permanent" className="pro-side-nav">
    <List>
      {items.map(({ to, icon, label, exact }) => (
        <ListItem button key={to} className="pro-side-nav-item">
          <NavLink to={to} exact={exact}>
            {typeof icon === 'string' ? <Icon type={icon} size={32} /> : icon}
            <h5>{label}</h5>
          </NavLink>
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default ProSideNav;
