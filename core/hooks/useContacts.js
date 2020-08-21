import uniqBy from 'lodash/uniqBy';

import { BORROWERS_COLLECTION } from '../api/borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from '../api/contacts/contactsConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../api/insuranceRequests/insuranceRequestConstants';
import { LOANS_COLLECTION } from '../api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from '../api/organisations/organisationConstants';
import { PROPERTY_CATEGORY } from '../api/properties/propertyConstants';
import { USERS_COLLECTION } from '../api/users/userConstants';
import collectionIcons from '../arrays/collectionIcons';
import { useStaticMeteorData } from './useMeteorData';

export const CONTACT_TYPES = {
  USER: 'USER',
  REFERRAL: 'REFERRAL',
  BORROWER: 'BORROWER',
  PERSONAL_CONTACT: 'PERSONAL_CONTACT',
  BROKER: 'PROPERTY_BROKER',
  PROMOTION_BROKER: 'PROMOTION_BROKER',
  LENDER: 'LENDER',
};

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
      type: CONTACT_TYPES.USER,
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
      type: CONTACT_TYPES.REFERRAL,
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
        type: CONTACT_TYPES.REFERRAL,
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
      type: CONTACT_TYPES.BORROWER,
    });
  });

  contacts.forEach(contact => {
    contactsArray.push({
      name: contact.name,
      email: contact.email,
      title: `Contact perso - ${contact.title}`,
      icon: collectionIcons[CONTACTS_COLLECTION],
      phoneNumber: contact.phoneNumber,
      type: CONTACT_TYPES.PERSONAL_CONTACT,
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
        type: CONTACT_TYPES.PROMOTION_BROKER,
      });
    });
  });

  return contactsArray;
};

const getInsuranceRequestContacts = props => {
  const contactsArray = getCommonContacts(props);
  return uniqBy(
    contactsArray.filter(({ email, phoneNumber }) => email || phoneNumber),
    'email',
  );
};

const getLoanContacts = props => {
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
        type: CONTACT_TYPES.LENDER,
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
        type: CONTACT_TYPES.PROMOTION_BROKER,
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

export const useLoanContacts = loanId => {
  const { loading, data: loanWithContacts } = useStaticMeteorData({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        _id: loanId,
      },
      user: {
        email: 1,
        phoneNumber: 1,
        name: 1,
        referredByUser: { email: 1, phoneNumber: 1, name: 1 },
        referredByOrganisation: { name: 1, emails: 1 },
      },
      borrowers: { email: 1, phoneNumber: 1, name: 1 },
      promotions: { _id: 1, users: { name: 1, email: 1, phoneNumber: 1 } },
      contacts: 1,
      lenders: {
        organisation: { name: 1 },
        contact: { name: 1, email: 1, phoneNumber: 1 },
      },
      properties: {
        $filters: { category: PROPERTY_CATEGORY.PRO },
        users: { name: 1, email: 1, phoneNumber: 1 },
      },
    },
    type: 'single',
  });
  const contacts = loanWithContacts && getLoanContacts(loanWithContacts);
  return { loading, contacts };
};

export const useInsuranceRequestContacts = insuranceRequestId => {
  const { loading, data: insuranceRequestWithContacts } = useStaticMeteorData({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: {
      $filters: { _id: insuranceRequestId },

      user: {
        email: 1,
        phoneNumber: 1,
        name: 1,
        referredByUser: { email: 1, phoneNumber: 1, name: 1 },
        referredByOrganisation: { name: 1, emails: 1 },
      },
      borrowers: { email: 1, phoneNumber: 1, name: 1 },
      contacts: 1,
    },
    type: 'single',
  });
  const contacts = !loading
    ? getInsuranceRequestContacts(insuranceRequestWithContacts)
    : [];
  return { loading, contacts };
};
