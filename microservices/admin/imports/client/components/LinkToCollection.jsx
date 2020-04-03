import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faUserTie } from '@fortawesome/pro-light-svg-icons/faUserTie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

import T from 'core/components/Translation';
import IconLink from 'core/components/IconLink';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { OFFERS_COLLECTION } from 'core/api/offers/offerConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';

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
