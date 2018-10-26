// @flow
import React from 'react';

import IconLink from './IconLink';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
} from '../../api/constants';

type CollectionIconLinkProps = {};

const getIconConfig = ({ collection, _id: docId, ...data }) => {
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
  default:
    break;
  }
};

const CollectionIconLink = ({ relatedDoc }: CollectionIconLinkProps) => {
  const { link, icon, text } = getIconConfig(relatedDoc);

  return <IconLink link={link} icon={icon} text={text} />;
};

export default CollectionIconLink;
