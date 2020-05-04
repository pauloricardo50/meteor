import uniqBy from 'lodash/uniqBy';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from '../../api/contacts/contactsConstants';
import { ORGANISATIONS_COLLECTION } from '../../api/organisations/organisationConstants';
import { USERS_COLLECTION } from '../../api/users/userConstants';
import collectionIcons from '../../arrays/collectionIcons';

const getCommonContacts = ({
  user,
  borrowers = [],
  contacts = [],
  properties = [],
}) => {
  const contactsArray = [];

  if (user) {
    contactsArray.push({
      name: user.name,
      email: user.email,
      title: 'Compte utilisateur',
      icon: collectionIcons[USERS_COLLECTION],
      phoneNumber: user.phoneNumber,
    });
  }

  if (user && user.referredByUser) {
    contactsArray.push({
      name: user.referredByUser.name,
      email: user.referredByUser.email,
      title: "Apporteur d'affaires",
      icon: collectionIcons[USERS_COLLECTION],
      phoneNumber: user.referredByUser.phoneNumber,
      isEmailable: true,
      withCta: true,
    });
  }

  if (user && !user.referredByUser && user.referredByOrganisation) {
    const {
      referredByOrganisation: { emails: orgEmails = [], name },
    } = user;
    orgEmails.forEach(email =>
      contactsArray.push({
        name: `${name} (${email.split('@')[0]})`,
        email,
        title: "Apporteur d'affaires",
        icon: collectionIcons[ORGANISATIONS_COLLECTION],
        isEmailable: true,
        withCta: false,
      }),
    );
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

  contacts.forEach(contact => {
    contactsArray.push({
      name: contact.name,
      email: contact.email,
      title: `Contact perso - ${contact.title}`,
      icon: collectionIcons[CONTACTS_COLLECTION],
      phoneNumber: contact.phoneNumber,
    });
  });

  properties.forEach(property => {
    property.users.forEach(pro => {
      contactsArray.push({
        name: pro.name,
        email: pro.email,
        title: `Courtier immobilier`,
        icon: collectionIcons[USERS_COLLECTION],
        phoneNumber: pro.phoneNumber,
        isEmailable: true,
      });
    });
  });

  return contactsArray;
};

export const getInsuranceRequestContacts = props => {
  const contactsArray = getCommonContacts(props);
  return uniqBy(
    contactsArray.filter(({ email, phoneNumber }) => email || phoneNumber),
    'email',
  );
};

export const getLoanContacts = props => {
  const contactsArray = getCommonContacts(props);
  const { lenders = [], promotions = [] } = props;

  lenders.forEach(({ organisation, contact }) => {
    if (contact) {
      contactsArray.push({
        name: `${contact.name} (${organisation.name})`,
        email: contact.email,
        title: `Prêteur`,
        icon: collectionIcons[CONTACTS_COLLECTION],
        phoneNumber: contact.phoneNumber,
        isEmailable: true,
        withCta: false,
      });
    }
  });

  promotions.forEach(({ $metadata: { invitedBy }, users = [] }) => {
    const invitedByUser = users.find(({ _id }) => _id === invitedBy);
    if (invitedByUser) {
      contactsArray.push({
        name: invitedByUser.name,
        email: invitedByUser.email,
        title: `Courtier de la promo`,
        icon: collectionIcons[CONTACTS_COLLECTION],
        phoneNumber: invitedByUser.phoneNumber,
        isEmailable: true,
        withCta: true,
      });
    }

    // TODO: Find out if this could be useful
    // const promoters = users.filter(({ $metadata }) =>
    //   $metadata.roles.includes(PROMOTION_USERS_ROLES.PROMOTER),
    // );

    // if (promoters.length > 0) {
    //   promoters.forEach(promoter => {
    //     contactsArray.push({
    //       name: promoter.name,
    //       email: promoter.email,
    //       title: `Promoteur`,
    //       icon: collectionIcons[USERS_COLLECTION],
    //       phoneNumber: promoter.phoneNumber,
    //       isEmailable: true,
    //     });
    //   });
    // }
  });

  return uniqBy(
    contactsArray.filter(({ email, phoneNumber }) => email || phoneNumber),
    'email',
  );
};
