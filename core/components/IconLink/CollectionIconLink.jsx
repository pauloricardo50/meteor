import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import cx from 'classnames';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from '../../api/contacts/contactsConstants';
import { getUserNameAndOrganisation } from '../../api/helpers';
import { INSURANCE_REQUESTS_COLLECTION } from '../../api/insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from '../../api/insurances/insuranceConstants';
import { LOANS_COLLECTION } from '../../api/loans/loanConstants';
import { OFFERS_COLLECTION } from '../../api/offers/offerConstants';
import { ORGANISATIONS_COLLECTION } from '../../api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from '../../api/promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';
import { ROLES, USERS_COLLECTION } from '../../api/users/userConstants';
import collectionIcons from '../../arrays/collectionIcons';
import { employeesById } from '../../arrays/epotekEmployees';
import {
  getInsuranceLinkTitle,
  getInsuranceRequestLinkTitle,
  getLoanLinkTitle,
} from './collectionIconLinkHelpers';
import CollectionIconLinkPopup from './CollectionIconLinkPopup/CollectionIconLinkPopup';
import IconLink from './IconLink';

const showPopups = Meteor.microservice === 'admin';

const getIconConfig = ({ _collection, _id: docId, ...data } = {}) => {
  if (!docId) {
    return {
      link: '/',
      icon: 'help',
      text: "N'existe plus",
    };
  }

  switch (_collection) {
    case LOANS_COLLECTION: {
      let text;

      text = getLoanLinkTitle(data);

      return {
        link: `/loans/${docId}`,
        text,
        hasPopup: true,
      };
    }
    case USERS_COLLECTION: {
      let text;
      const { organisations = [], roles = [] } = data;
      if (
        (roles.includes(ROLES.ADMIN) || roles.includes(ROLES.DEV)) &&
        employeesById[docId]
      ) {
        text = (
          <img
            src={employeesById[docId].src}
            alt={data.name}
            style={{ borderRadius: '50%', width: 20, height: 20 }}
          />
        );
      } else if (organisations.length) {
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
        text: data.name || 'Emprunteur sans nom',
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
    case INSURANCE_REQUESTS_COLLECTION:
      return {
        link: `/insuranceRequests/${docId}`,
        text: getInsuranceRequestLinkTitle(data),
        hasPopup: true,
      };
    case INSURANCES_COLLECTION: {
      const { insuranceRequest } = data;
      const { _id: insuranceRequestId } = insuranceRequest;
      return {
        link: `/insuranceRequests/${insuranceRequestId}/${docId}`,
        text: getInsuranceLinkTitle(data),
        hasPopup: true,
      };
    }
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
  forceOpen,
  iconClassName,
  relatedDoc,
  showIcon,
  stopPropagation,
  placement,
  data,
  replacementPopup,
  noRoute,
  iconStyle,
  children,
  onClick,
}) => {
  const { _collection, _id: docId } = relatedDoc;

  if (!docId) {
    return null;
  }

  const {
    link,
    icon = collectionIcons[_collection],
    text,
    hasPopup,
  } = getIconConfig(relatedDoc);

  if ((showPopups && hasPopup) || replacementPopup) {
    return (
      <CollectionIconLinkPopup
        {...relatedDoc}
        key={relatedDoc._id}
        forceOpen={forceOpen}
        placement={placement}
        data={data}
        replacementPopup={replacementPopup}
      >
        <IconLink
          link={link}
          icon={icon}
          text={text}
          className={cx('collection-icon', {
            'font-awesome': typeof icon !== 'string',
          })}
          stopPropagation={stopPropagation}
          iconClassName={iconClassName}
          iconStyle={iconStyle}
          showIcon={showIcon}
          noRoute={noRoute}
          onClick={onClick}
        >
          {children}
        </IconLink>
      </CollectionIconLinkPopup>
    );
  }

  return (
    <IconLink
      link={link}
      icon={icon}
      text={text}
      stopPropagation={stopPropagation}
      className={cx('collection-icon', {
        'font-awesome': typeof icon !== 'string',
      })}
      iconClassName={iconClassName}
      iconStyle={iconStyle}
      showIcon={showIcon}
      noIcon
      noRoute={noRoute}
      onClick={onClick}
    >
      {children}
    </IconLink>
  );
};

export default CollectionIconLink;
