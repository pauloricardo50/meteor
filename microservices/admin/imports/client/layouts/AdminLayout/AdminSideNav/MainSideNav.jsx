import React, { useMemo } from 'react';
import { faProjectDiagram } from '@fortawesome/pro-light-svg-icons/faProjectDiagram';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import List from 'core/components/Material/List';
import useCurrentUser from 'core/hooks/useCurrentUser';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
import MainSideNavListItem from './MainSideNavListItem';

const getItems = currentUser =>
  [
    {
      label: 'Dashboard',
      icon: 'home',
      to: ADMIN_ROUTES.DASHBOARD_PAGE.path,
    },
    {
      label: 'Dossiers',
      icon: 'viewWeek',
      to: '/board',
    },
    {
      collection: USERS_COLLECTION,
      to: '/users',
    },
    {
      collection: LOANS_COLLECTION,
      to: '/loans',
    },
    {
      collection: INSURANCE_REQUESTS_COLLECTION,
      to: '/insuranceRequests',
      label: 'Assurances',
    },
    {
      collection: PROMOTIONS_COLLECTION,
      to: '/promotions',
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
      label: 'Dev',
      icon: 'developerMode',
      to: ADMIN_ROUTES.DEV_PAGE.path,
      show: !!(currentUser && currentUser.isDev),
    },
  ]
    .filter(({ shouldShow }) => shouldShow !== false)
    .map(obj => ({
      ...obj,
      icon: obj.icon || collectionIcons[obj.collection],
    }));

const MainSideNav = props => {
  const currentUser = useCurrentUser();
  const items = useMemo(() => getItems(currentUser), [currentUser]);

  return (
    <List className="main-side-nav">
      {items.map((item, index) => (
        <MainSideNavListItem
          onClick={() => props.toggleDrawer()}
          key={index}
          {...item}
          {...props}
        />
      ))}
    </List>
  );
};

export default MainSideNav;
