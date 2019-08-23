import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/pro-light-svg-icons/faProjectDiagram';

import List from '@material-ui/core/List';

import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  REVENUES_COLLECTION,
} from 'core/api/constants';
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
    label: 'Organisations',
    to: ADMIN_ROUTES.ORGANISATIONS_PAGE.path,
    collection: ORGANISATIONS_COLLECTION,
  },
  {
    label: 'Revenus',
    to: createRoute(ADMIN_ROUTES.REVENUES_PAGE.path, { tabId: 'monitoring' }),
    collection: REVENUES_COLLECTION,
  },
  {
    label: 'Autres',
    to: '/other/interestRates',
    icon: (
      <FontAwesomeIcon icon={faProjectDiagram} className="collection-icon" />
    ),
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

MainSideNav.propTypes = {
  hideDetailNav: PropTypes.func.isRequired,
  showDetailNav: PropTypes.func.isRequired,
};

export default MainSideNav;
