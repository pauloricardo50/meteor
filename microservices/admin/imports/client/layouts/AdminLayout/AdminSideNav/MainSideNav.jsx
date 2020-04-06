import React, { useContext, useMemo } from 'react';
import { faProjectDiagram } from '@fortawesome/pro-light-svg-icons/faProjectDiagram';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
import MainSideNavListItem from './MainSideNavListItem';

const getItems = currentUser =>
  [
    {
      label: 'Dashboard',
      icon: 'home',
      to: ADMIN_ROUTES.DASHBOARD_PAGE.path,
      exact: true,
    },
    {
      label: 'Dossiers',
      icon: 'viewWeek',
      to: '/board',
      exact: true,
    },
    {
      detail: true,
      collection: USERS_COLLECTION,
    },
    {
      detail: true,
      collection: LOANS_COLLECTION,
    },
    {
      collection: INSURANCE_REQUESTS_COLLECTION,
      to: '/insuranceRequests',
      exact: true,
      label: 'Assurances',
    },
    {
      collection: PROMOTIONS_COLLECTION,
      detail: true,
    },
    {
      label: 'Organisations',
      to: ADMIN_ROUTES.ORGANISATIONS_PAGE.path,
      collection: ORGANISATIONS_COLLECTION,
    },
    {
      label: 'Monitoring',
      to: createRoute(ADMIN_ROUTES.REVENUES_PAGE.path, { tabId: 'monitoring' }),
      collection: REVENUES_COLLECTION,
    },
    {
      label: 'Autres',
      to: '/other/interestRates',
      icon: (
        <FontAwesomeIcon icon={faProjectDiagram} className="collection-icon" />
      ),
      collection: 'other',
    },
    {
      label: 'Wik-e-Potek',
      to: '/wiki/emails',
      icon: (
        <FontAwesomeIcon icon={faQuestionCircle} className="collection-icon" />
      ),
      collection: 'wiki',
    },
    {
      label: 'Dev',
      icon: 'developerMode',
      to: ADMIN_ROUTES.DEV_PAGE.path,
      exact: true,
      show: !!(currentUser && currentUser.isDev),
    },
  ]
    .filter(({ shouldShow }) => shouldShow !== false)
    .map(obj => ({
      ...obj,
      icon: obj.icon || collectionIcons[obj.collection],
    }));

const createOnClickHandler = (
  { detail, collection },
  { hideDetailNav, showDetailNav, collectionName, toggleDrawer },
) => {
  if (detail) {
    if (collection === collectionName) {
      return hideDetailNav;
    }
    return () => showDetailNav(collection);
  }
  return () => {
    hideDetailNav();
    toggleDrawer();
  };
};

const MainSideNav = props => {
  const currentUser = useContext(CurrentUserContext);
  const items = useMemo(() => getItems(currentUser), [currentUser]);

  return (
    <List className="main-side-nav">
      {items.map((item, index) => (
        <MainSideNavListItem
          onClick={createOnClickHandler(item, props)}
          key={index}
          {...item}
          {...props}
        />
      ))}
    </List>
  );
};

MainSideNav.propTypes = {
  hideDetailNav: PropTypes.func.isRequired,
  showDetailNav: PropTypes.func.isRequired,
};

export default MainSideNav;
