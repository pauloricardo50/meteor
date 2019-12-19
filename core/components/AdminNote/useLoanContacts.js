import uniqBy from 'lodash/uniqBy';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminLoans } from 'core/api/loans/queries';
import collectionIcons from 'core/arrays/collectionIcons';
import {
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';

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
      isEmailable: true,
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
        isEmailable: true,
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
        isEmailable: true,
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

const useLoanContacts = loanId => {
  const { loading, data: loanWithContacts } = useStaticMeteorData({
    query: adminLoans,
    params: {
      _id: loanId,
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
  const contacts = !loading ? getLoanContacts(loanWithContacts) : [];
  return { loading, contacts };
};

export default useLoanContacts;
