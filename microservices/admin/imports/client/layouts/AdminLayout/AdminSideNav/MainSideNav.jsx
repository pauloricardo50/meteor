import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faChartLine } from '@fortawesome/pro-light-svg-icons/faChartLine';
import { faUserTie } from '@fortawesome/pro-light-svg-icons/faUserTie';

import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  TASKS_COLLECTION,
  USERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
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
    icon: <FontAwesomeIcon icon={faCity} className="admin-side-nav-icon" />,
    collection: PROMOTIONS_COLLECTION,
    detail: true,
  },
  {
    icon: 'people',
    detail: true,
    collection: BORROWERS_COLLECTION,
  },
  {
    icon: 'domain',
    detail: true,
    collection: PROPERTIES_COLLECTION,
  },
  {
    label: 'Tâches',
    icon: 'check',
    to: '/tasks',
    collection: TASKS_COLLECTION,
  },
  {
    label: 'Organisations',
    icon: (
      <FontAwesomeIcon icon={faBriefcase} className="admin-side-nav-icon" />
    ),
    to: '/organisations',
    collection: ORGANISATIONS_COLLECTION,
  },
  {
    label: 'Contacts',
    icon: <FontAwesomeIcon icon={faUserTie} className="admin-side-nav-icon" />,
    detail: true,
    collection: CONTACTS_COLLECTION,
  },
  {
    label: 'Taux',
    icon: (
      <FontAwesomeIcon icon={faChartLine} className="admin-side-nav-icon" />
    ),
    to: '/interestRates',
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
