import React from 'react';
import PropTypes from 'prop-types';

import List from 'material-ui/List';
import MainSideNavListItem from './MainSideNavListItem';

const items = [
  { label: 'Dashboard', icon: 'home' },
  { label: 'Utilisateurs', icon: 'contactMail' },
  { label: 'Hypothèques', icon: 'dollarSign' },
  { label: 'Emprunteurs', icon: 'people' },
  { label: 'Tâches', icon: 'check' },
];

const MainSideNavList = () => (
  <List>
    {items.map((item, index) => <MainSideNavListItem key={index} {...item} />)}
  </List>
);

MainSideNavList.propTypes = {};

export default MainSideNavList;
