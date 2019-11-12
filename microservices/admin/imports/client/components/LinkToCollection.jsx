import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faUserTie } from '@fortawesome/pro-light-svg-icons/faUserTie';

import T from 'core/components/Translation';
import IconLink from 'core/components/IconLink';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';

const getCollectionIcon = collection => {
  switch (collection) {
    case BORROWERS_COLLECTION:
      return 'people';
    case LOANS_COLLECTION:
      return 'dollarSign';
    case PROPERTIES_COLLECTION:
      return 'building';
    case USERS_COLLECTION:
      return 'contactMail';
    case PROMOTIONS_COLLECTION:
      return <FontAwesomeIcon icon={faCity} className="icon-link-icon" />;
    case OFFERS_COLLECTION:
      return 'monetizationOn';
    case ORGANISATIONS_COLLECTION:
      return <FontAwesomeIcon icon={faBriefcase} className="icon-link-icon" />;
    case CONTACTS_COLLECTION:
      return <FontAwesomeIcon icon={faUserTie} className="icon-link-icon" />;

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
