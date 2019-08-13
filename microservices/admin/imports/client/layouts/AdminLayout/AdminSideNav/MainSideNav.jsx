import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';

import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  TASKS_COLLECTION,
  USERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
  REVENUES_COLLECTION,
} from 'core/api/constants';
import { INTEREST_RATES_COLLECTION } from 'imports/core/api/constants';
import collectionIcons from 'core/arrays/collectionIcons';
import { createRoute } from 'imports/core/utils/routerUtils';
import MainSideNavListItem from './MainSideNavListItem';
import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';

const items = [
  {
    label: 'Dashboard',
    icon: 'home',
    to: ADMIN_ROUTES.DASHBOARD_PAGE.path,
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
    collection: PROMOTIONS_COLLECTION,
    detail: true,
  },
  {
    detail: true,
    collection: BORROWERS_COLLECTION,
  },
  {
    detail: true,
    collection: PROPERTIES_COLLECTION,
  },
  {
    label: 'Tâches',
    to: ADMIN_ROUTES.TASKS_PAGE.path,
    collection: TASKS_COLLECTION,
  },
  {
    label: 'Organisations',
    to: ADMIN_ROUTES.ORGANISATIONS_PAGE.path,
    collection: ORGANISATIONS_COLLECTION,
  },
  {
    label: 'Contacts',
    detail: true,
    collection: CONTACTS_COLLECTION,
  },
  {
    label: 'Taux',
    to: ADMIN_ROUTES.INTEREST_RATES_PAGE.path,
    collection: INTEREST_RATES_COLLECTION,
  },
  {
    label: 'Revenus',
    to: createRoute(ADMIN_ROUTES.REVENUES_PAGE.path, { tabId: 'monitoring' }),
    collection: REVENUES_COLLECTION,
  },
  { label: 'Dev', icon: 'developerMode', to: ADMIN_ROUTES.DEV_PAGE.path },
].map(obj => ({ ...obj, icon: obj.icon || collectionIcons[obj.collection] }));

const createOnClickHandler = (
  { detail, collection },
  { hideDetailNav, showDetailNav, collectionName },
) => {
  if (detail) {
    if (collection === collectionName) {
      return hideDetailNav;
    }
    return () => showDetailNav(collection);
  }
  return hideDetailNav;
};

const MainSideNav = props => (
  <List>
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

MainSideNav.propTypes = {
  hideDetailNav: PropTypes.func.isRequired,
  showDetailNav: PropTypes.func.isRequired,
};

export default MainSideNav;
