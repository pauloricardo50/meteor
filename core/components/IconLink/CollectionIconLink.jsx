// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Roles } from 'meteor/alanning:roles';

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
import CollectionIconLinkPopup from './CollectionIconLinkPopup/CollectionIconLinkPopup';

type CollectionIconLinkProps = {
  relatedDoc: Object,
  stopPropagation?: Boolean,
};

const showPopups = Meteor.microservice === 'admin';

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
      hasPopup: true,
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
      hasPopup: true,
    };
  }
  case BORROWERS_COLLECTION:
    return {
      link: `/borrowers/${docId}`,
      text: data.name,
      hasPopup: true,
    };
  case PROPERTIES_COLLECTION:
    return {
      link: `/properties/${docId}`,
      text: data.address1,
      hasPopup: true,
    };
  case OFFERS_COLLECTION:
    return {
      link: `/offers/${docId}`,
      text: data.organisation.name,
      hasPopup: true,
    };
  case PROMOTIONS_COLLECTION:
    return {
      link: `/promotions/${docId}`,
      text: data.name,
      hasPopup: true,
    };
  case ORGANISATIONS_COLLECTION: {
    let text;
    const isDev = Roles.userIsInRole(Meteor.userId(), 'dev');
    const isMain = data.$metadata && data.$metadata.isMain;

    if (data.$metadata && data.$metadata.title) {
      text = `${data.$metadata.title} @ ${data.name}${
        isDev && isMain ? ' (main)' : ''
      }`;
    } else {
      text = `${data.name}${isDev && isMain ? ' (main)' : ''}`;
    }

    return {
      link: `/organisations/${docId}`,
      text,
      hasPopup: true,
    };
  }
  case CONTACTS_COLLECTION:
    return {
      link: `/contacts/${docId}`,
      text: data.name,
      hasPopup: true,
    };
  case 'NOT_FOUND':
    return {
      link: '/',
      icon: 'help',
      text: "N'existe plus",
    };

  default:
    return { text: 'Unknown collection' };
  }
};

const CollectionIconLink = ({
  relatedDoc,
  stopPropagation,
}: CollectionIconLinkProps) => {
  const { collection, _id: docId } = relatedDoc;

  if (!docId) {
    return null;
  }

  const {
    link,
    icon = collectionIcons[collection],
    text,
    hasPopup,
  } = getIconConfig(relatedDoc);

  if (showPopups && hasPopup) {
    return (
      <CollectionIconLinkPopup {...relatedDoc} key={relatedDoc._id}>
        <IconLink
          link={link}
          icon={icon}
          text={text}
          className="collection-icon"
          stopPropagation={stopPropagation}
        />
      </CollectionIconLinkPopup>
    );
  }

  return (
    <IconLink
      link={link}
      icon={icon}
      text={text}
      stopPropagation={stopPropagation}
      className="collection-icon"
    />
  );
};

export default CollectionIconLink;
