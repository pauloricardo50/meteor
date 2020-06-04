import React from 'react';
import { faBook } from '@fortawesome/pro-light-svg-icons/faBook';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Drawer from '@material-ui/core/Drawer';
import { NavLink } from 'react-router-dom';

import Icon from 'core/components/Icon';
import List from 'core/components/Material/List';
import ListItem from 'core/components/Material/ListItem';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import { getMainOrganisation } from 'core/utils/userFunctions';

import PRO_ROUTES from '../../startup/client/proRoutes';

const getItems = (currentUser = {}) => {
  const mainOrganisation = getMainOrganisation(currentUser);

  return [
    {
      label: <T id="ProSideNav.dashboard" />,
      to: createRoute(PRO_ROUTES.PRO_DASHBOARD_PAGE.path, { tabId: 'loans' }),
      icon: 'home',
    },
    {
      label: <T id="ProSideNav.revenues" />,
      to: createRoute(PRO_ROUTES.PRO_REVENUES_PAGE.path),
      icon: 'monetizationOn',
      condition: !!(mainOrganisation?.commissionRates?.length > 0),
    },
    {
      label: <T id="ProSideNav.organisation" />,
      to: createRoute(PRO_ROUTES.PRO_ORGANISATION_PAGE.path, { tabId: '' }),
      icon: <FontAwesomeIcon icon={faBriefcase} className="collection-icon" />,
    },
    {
      label: <T id="ProSideNav.documentation" />,
      href: 'https://pro.e-potek.ch/doc',
      icon: <FontAwesomeIcon icon={faBook} className="collection-icon" />,
    },
  ].filter(({ condition = true }) => condition);
};

const ProSideNav = ({ currentUser }) => {
  if (!currentUser) {
    return null;
  }

  return (
    <Drawer variant="permanent" className="pro-side-nav">
      <List>
        {getItems(currentUser).map(({ to, icon, label, exact, href }) => (
          <ListItem button key={to || href} className="pro-side-nav-item">
            {href ? (
              <a href={href} target="_blank">
                {typeof icon === 'string' ? (
                  <Icon type={icon} size={32} />
                ) : (
                  icon
                )}
                <small>{label}</small>
              </a>
            ) : (
              <NavLink to={to} exact={exact}>
                {typeof icon === 'string' ? (
                  <Icon type={icon} size={32} />
                ) : (
                  icon
                )}
                <small>{label}</small>
              </NavLink>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default ProSideNav;
