import React from 'react';
import PropTypes from 'prop-types';

import List from 'material-ui/List';

import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  TASKS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

import MainSideNavListItem from './MainSideNavListItem';

const items = [
  { label: 'Dashboard', icon: 'home', to: '/', exact: true },
  {
    icon: 'contactMail',
    detail: true,
    collection: USERS_COLLECTION,
  },
  {
    icon: 'dollarSign',
    detail: true,
    collection: LOANS_COLLECTION,
  },
  {
    icon: 'people',
    detail: true,
    collection: BORROWERS_COLLECTION,
  },
  {
    label: 'Tâches',
    icon: 'check',
    to: '/tasks',
    collection: TASKS_COLLECTION,
  },
  { label: 'Dev', icon: 'developerMode', to: '/dev' },
];

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
    {items.map(item => (
      <MainSideNavListItem
        onClick={createOnClickHandler(item, props)}
        key={item.label}
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
