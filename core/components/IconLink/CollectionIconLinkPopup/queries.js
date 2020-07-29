import { BORROWERS_COLLECTION } from '../../../api/borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from '../../../api/contacts/contactsConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../../api/insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from '../../../api/insurances/insuranceConstants';
import { LOANS_COLLECTION } from '../../../api/loans/loanConstants';
import { OFFERS_COLLECTION } from '../../../api/offers/offerConstants';
import { ORGANISATIONS_COLLECTION } from '../../../api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from '../../../api/promotions/promotionConstants';
import { PROPERTIES_COLLECTION } from '../../../api/properties/propertyConstants';
import { createQuery } from '../../../api/queries';
import { USERS_COLLECTION } from '../../../api/users/userConstants';

const makeQuery = (collection, params, cb) =>
  createQuery({ [collection]: params }).fetchOne(cb);

export default {
  [LOANS_COLLECTION]: (_id, cb) =>
    makeQuery(
      LOANS_COLLECTION,
      {
        $filters: { _id },
        anonymous: true,
        borrowers: { name: 1 },
        category: 1,
        mainAssignee: 1,
        name: 1,
        promotions: { name: 1 },
        properties: { category: 1, address1: 1 },
        selectedStructure: 1,
        status: 1,
        structures: { wantedLoan: 1, id: 1 },
        user: { name: 1 },
      },
      cb,
    ),
  [USERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      USERS_COLLECTION,
      {
        $filters: { _id },
        assignedEmployee: { name: 1 },
        email: 1,
        emails: 1,
        isDisabled: 1,
        loans: { name: 1 },
        name: 1,
        organisations: { name: 1 },
        phoneNumbers: 1,
        referredByOrganisation: { name: 1 },
        referredByUser: { name: 1 },
        roles: 1,
        status: 1,
      },
      cb,
    ),
  [BORROWERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      BORROWERS_COLLECTION,
      {
        $filters: { _id },
        age: 1,
        bankFortune: 1,
        loans: { name: 1 },
        name: 1,
        salary: 1,
        user: { name: 1, assignedEmployee: { name: 1 } },
      },
      cb,
    ),
  [PROPERTIES_COLLECTION]: (_id, cb) =>
    makeQuery(
      PROPERTIES_COLLECTION,
      {
        $filters: { _id },
        address1: 1,
        category: 1,
        documents: { propertyImages: 1 },
        loans: { name: 1 },
        name: 1,
        status: 1,
        totalValue: 1,
        users: { organisations: { name: 1 }, name: 1 },
      },
      cb,
    ),
  [OFFERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      OFFERS_COLLECTION,
      {
        $filters: { _id },
        createdAt: 1,
        feedback: 1,
        lender: { organisation: { name: 1, logo: 1 }, loan: { name: 1 } },
        maxAmount: 1,
      },
      cb,
    ),
  [PROMOTIONS_COLLECTION]: (_id, cb) =>
    makeQuery(
      PROMOTIONS_COLLECTION,
      {
        $filters: { _id },
        availablePromotionLots: 1,
        reservedPromotionLots: 1,
        documents: { promotionImage: 1 },
        lenderOrganisation: { name: 1 },
        name: 1,
        signingDate: 1,
        soldPromotionLots: 1,
        status: 1,
      },
      cb,
    ),
  [ORGANISATIONS_COLLECTION]: (_id, cb) =>
    makeQuery(
      ORGANISATIONS_COLLECTION,
      {
        $filters: { _id },
        contacts: { name: 1 },
        features: 1,
        logo: 1,
        name: 1,
        offerCount: 1,
        referredCustomers: { _id: 1 },
        type: 1,
        users: { name: 1 },
      },
      cb,
    ),
  [CONTACTS_COLLECTION]: (_id, cb) =>
    makeQuery(
      CONTACTS_COLLECTION,
      {
        $filters: { _id },
        email: 1,
        name: 1,
        organisations: { name: 1, logo: 1 },
        phoneNumbers: 1,
      },
      cb,
    ),
  [INSURANCES_COLLECTION]: (_id, cb) =>
    makeQuery(
      INSURANCES_COLLECTION,
      {
        $filters: { _id },
        name: 1,
        organisation: { name: 1, logo: 1 },
        insuranceRequest: { _id: 1 },
        status: 1,
        premium: 1,
        premiumFrequency: 1,
        insuranceProduct: { name: 1 },
        borrower: { name: 1 },
        duration: 1,
      },
      cb,
    ),
  [INSURANCE_REQUESTS_COLLECTION]: (_id, cb) =>
    makeQuery(
      INSURANCE_REQUESTS_COLLECTION,
      {
        $filters: { _id },
        name: 1,
        status: 1,
        borrowers: { name: 1 },
        mainAssignee: { name: 1 },
        user: { name: 1 },
      },
      cb,
    ),
};
