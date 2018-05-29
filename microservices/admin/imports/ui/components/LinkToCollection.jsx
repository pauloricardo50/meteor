import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import IconLink from 'core/components/IconLink';
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
  <IconLink
    link={`/${collection}`}
    icon={getCollectionIcon(collection)}
    text={<T id={`collections.${collection}`} />}
  />
);

LinkToCollection.propTypes = {
  collection: PropTypes.string.isRequired,
};

export default LinkToCollection;
