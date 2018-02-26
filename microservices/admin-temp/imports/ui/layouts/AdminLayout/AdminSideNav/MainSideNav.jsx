import React from 'react';
import PropTypes from 'prop-types';

import List from 'material-ui/List';
import MainSideNavListItem from './MainSideNavListItem';

const items = [
  { label: 'Dashboard', icon: 'home', to: '/', exact: true },
  {
    icon: 'contactMail',
    detail: true,
    collection: 'users',
  },
  {
    icon: 'dollarSign',
    detail: true,
    collection: 'loans',
  },
  {
    icon: 'people',
    detail: true,
    collection: 'borrowers',
  },
  { label: 'Tâches', icon: 'check', to: '/tasks', collection: 'tasks' },
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
