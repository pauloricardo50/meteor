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
import PRO_ROUTES from '../../startup/client/proRoutes';

const getItems = (currentUser = {}) => {
  const { organisations = [] } = currentUser;
  return [
    {
      label: <T id="ProSideNav.dashboard" />,
      to: PRO_ROUTES.PRO_DASHBOARD_PAGE.path,
      icon: 'home',
      exact: true,
    },
    {
      label: <T id="ProSideNav.revenues" />,
      to: createRoute(PRO_ROUTES.PRO_REVENUES_PAGE.path),
      icon: 'monetizationOn',
      condition: !!(
        organisations.length
        && organisations[0].commissionRates
        && organisations[0].commissionRates.length > 0
      ),
    },
    {
      label: <T id="ProSideNav.organisation" />,
      to: createRoute(PRO_ROUTES.PRO_ORGANISATION_PAGE.path, { tabId: '' }),
      icon: <FontAwesomeIcon icon={faBriefcase} className="collection-icon" />,
    },
  ].filter(({ condition = true }) => condition);
};

type ProSideNavProps = {};

const ProSideNav = ({ currentUser }: ProSideNavProps) => (
  <Drawer variant="permanent" className="pro-side-nav">
    <List>
      {getItems(currentUser).map(({ to, icon, label, exact }) => (
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
