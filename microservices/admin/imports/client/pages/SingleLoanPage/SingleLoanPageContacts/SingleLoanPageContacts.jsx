// @flow
import React from 'react';
import uniqBy from 'lodash/uniqBy';

import Icon from 'core/components/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import {
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import colors from 'core/config/colors';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminLoans } from 'core/api/loans/queries';

type SingleLoanPageContactsProps = {};

const getLoanContacts = ({
  user,
  borrowers = [],
  contacts = [],
  lenders = [],
  promotions = [],
}) => {
  const contactsArray = [];

  if (user) {
    contactsArray.push({
      name: user.name,
      email: user.email,
      title: 'Compte utilisateur',
      icon: collectionIcons[USERS_COLLECTION],
      phoneNumber: user.phoneNumbers && user.phoneNumbers[0],
    });
  }

  if (user && user.referredByUser) {
    contactsArray.push({
      name: user.referredByUser.name,
      email: user.referredByUser.email,
      title: "Apporteur d'affaires",
      icon: collectionIcons[USERS_COLLECTION],
      phoneNumber:
        user.referredByUser.phoneNumbers && user.referredByUser.phoneNumbers[0],
    });
  }

  borrowers.forEach((borrower, index) => {
    contactsArray.push({
      name: borrower.name || `Emprunteur ${index + 1}`,
      email: borrower.email,
      title: 'Emprunteur',
      icon: collectionIcons[BORROWERS_COLLECTION],
      phoneNumber: borrower.phoneNumber,
    });
  });

  lenders.forEach(({ organisation, contact }) => {
    if (contact) {
      contactsArray.push({
        name: `${contact.name} (${organisation.name})`,
        email: contact.email,
        title: `Prêteur`,
        icon: collectionIcons[CONTACTS_COLLECTION],
        phoneNumber: contact.phoneNumber,
      });
    }
  });

  promotions.forEach(({ $metadata: { invitedBy }, users }) => {
    const invitedByUser = users.find(({ _id }) => _id === invitedBy);
    if (invitedByUser) {
      contactsArray.push({
        name: invitedByUser.name,
        email: invitedByUser.email,
        title: `Courtier de la promo`,
        icon: collectionIcons[CONTACTS_COLLECTION],
        phoneNumber: invitedByUser.phoneNumber,
      });
    }
  });

  contacts.forEach(contact => {
    contactsArray.push({
      name: contact.name,
      email: contact.email,
      title: `Contact perso - ${contact.title}`,
      icon: collectionIcons[CONTACTS_COLLECTION],
      phoneNumber: contact.phoneNumber,
    });
  });

  return uniqBy(
    contactsArray.filter(({ email, phoneNumber }) => email || phoneNumber),
    'email',
  );
};

const Contact = ({
  name,
  email = '-',
  title = 'Contact perso',
  icon,
  phoneNumber = '-',
}) => (
    <div key={email} className="single-loan-page-contacts-contact">
      <div className="flex center-align">
        <Icon type={icon} className="mr-4" />
        <h4>
          {name} <small className="secondary">{title}</small>
        </h4>
      </div>
      <div className="flex center-align">
        <span className="flex center-align mr-8">
          <Icon
            className="mr-4"
            type="mail"
            style={{ color: colors.borderGrey }}
          />
          <a
            className="color"
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>
        </span>
        <span className="flex center-align">
          <Icon
            className="mr-4"
            type="phone"
            style={{ color: colors.borderGrey }}
          />
          <a key={phoneNumber} href={`tel:${phoneNumber}`}>
            <span>{phoneNumber}</span>
          </a>
        </span>
      </div>
    </div>
  );

const SingleLoanPageContacts = ({ loan }: SingleLoanPageContactsProps) => {
  const { loading, data: loanWithContacts } = useStaticMeteorData({
    query: adminLoans,
    params: {
      _id: loan._id,
      $body: {
        user: {
          email: 1,
          phoneNumber: 1,
          name: 1,
          referredByUser: { email: 1, phoneNumber: 1, name: 1 },
        },
        borrowers: { email: 1, phoneNumber: 1, name: 1 },
        promotions: { _id: 1, users: { name: 1, email: 1, phoneNumber: 1 } },
        contacts: 1,
        lenders: {
          organisation: { name: 1 },
          contact: { name: 1, email: 1, phoneNumber: 1 },
        },
      },
    },
    type: 'single',
  });
  const contacts = !loading && getLoanContacts(loanWithContacts);
  return (
    <div className="single-loan-page-contacts card1 card-top">
      <h3>Contacts</h3>

      {!loading &&
        contacts.map(contact => <Contact {...contact} key={contact.name} />)}
      {!loading && contacts.length === 0 && (
        <h2 className="secondary text-center">Pas de contacts</h2>
      )}
    </div>
  );
};

export default SingleLoanPageContacts;
