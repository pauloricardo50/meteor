import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

const getCollectionIcon = (collection) => {
  switch (collection) {
  case BORROWERS_COLLECTION:
    return 'people';
  case LOANS_COLLECTION:
    return 'dollarSign';
  case PROPERTIES_COLLECTION:
    return 'building';
  case USERS_COLLECTION:
    return 'contactMail';
  default:
    return null;
  }
};

const LinkToCollection = ({ collection }) => (
  <Link to={`/${collection}`}>
    <Icon type={getCollectionIcon(collection)} />
    <T id={`collections.${collection}`} />
  </Link>
);

LinkToCollection.propTypes = {
  collection: PropTypes.string.isRequired,
};

export default LinkToCollection;
