// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faCity } from '@fortawesome/pro-light-svg-icons/faCity';
import { faUserTie } from '@fortawesome/pro-light-svg-icons/faUserTie';

import { getUserNameAndOrganisation } from '../../api/helpers';
import IconLink from './IconLink';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from '../../api/constants';
import collectionIcons from '../../arrays/collectionIcons';

type CollectionIconLinkProps = {
  relatedDoc: Object,
};

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
      text: data.name,
    };
  case USERS_COLLECTION: {
    let text;
    const { organisations = [] } = data;

    if (organisations.length) {
      text = getUserNameAndOrganisation({ user: data });
    } else {
      text = data.name;
    }

    return {
      link: `/users/${docId}`,
      text,
    };
  }
  case BORROWERS_COLLECTION:
    return {
      link: `/borrowers/${docId}`,
      text: data.name,
    };
  case PROPERTIES_COLLECTION:
    return {
      link: `/properties/${docId}`,
      text: data.address1,
    };
  case OFFERS_COLLECTION:
    return {
      link: `/offers/${docId}`,
      text: data.organisation,
    };
  case PROMOTIONS_COLLECTION:
    return {
      link: `/promotions/${docId}`,
      text: data.name,
    };
  case ORGANISATIONS_COLLECTION: {
    let text;

    if (data.$metadata && data.$metadata.title) {
      text = `${data.$metadata.title} @ ${data.name}`;
    } else if (data.logo) {
      text = (
        <div style={{ width: 100, height: 30 }}>
          <img
            src={data.logo}
            alt={data.name}
            style={{ maxWidth: 100, maxHeight: 30 }}
          />
        </div>
      );
    } else {
      text = data.name;
    }

    return {
      link: `/organisations/${docId}`,
      text,
    };
  }
  case CONTACTS_COLLECTION:
    return {
      link: `/contacts/${docId}`,
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
  const { collection } = relatedDoc;
  const { link, icon = collectionIcons[collection], text } = getIconConfig(relatedDoc);

  return (
    <IconLink link={link} icon={icon} text={text} className="collection-icon" />
  );
};

export default CollectionIconLink;
