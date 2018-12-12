// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/pro-light-svg-icons';

import IconLink from './IconLink';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
} from '../../api/constants';

type CollectionIconLinkProps = {};

const getIconConfig = ({ collection, _id: docId, ...data } = {}) => {
  if (!docId) {
    return {
      link: '/',
      icon: 'help',
      text: "N'existe plus",
    };
  }

  switch (collection) {
  case LOANS_COLLECTION:
    return {
      link: `/loans/${docId}`,
      icon: 'dollarSign',
      text: data.name,
    };
  case USERS_COLLECTION:
    return {
      link: `/users/${docId}`,
      icon: 'contactMail',
      text: data.name,
    };
  case BORROWERS_COLLECTION:
    return {
      link: `/borrowers/${docId}`,
      icon: 'people',
      text: data.name,
    };
  case PROPERTIES_COLLECTION:
    return {
      link: `/properties/${docId}`,
      icon: 'building',
      text: data.address1,
    };
  case OFFERS_COLLECTION:
    return {
      link: `/offers/${docId}`,
      icon: 'monetizationOn',
      text: data.organisation,
    };
  case PROMOTIONS_COLLECTION:
    return {
      link: `/promotions/${docId}`,
      icon: <FontAwesomeIcon icon={faCity} className="icon-link-icon" />,
      text: data.name,
    };
  case 'NOT_FOUND':
    return {
      link: '/',
      icon: 'help',
      text: "N'existe plus",
    };

  default:
    return {
      text: 'Unknown collection',
    };
  }
};

const CollectionIconLink = ({ relatedDoc }: CollectionIconLinkProps) => {
  const { link, icon, text } = getIconConfig(relatedDoc);

  return <IconLink link={link} icon={icon} text={text} />;
};

export default CollectionIconLink;
