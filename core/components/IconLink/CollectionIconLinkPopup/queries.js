import { adminLoans } from 'core/api/loans/queries';
import adminUsers from 'core/api/users/queries/adminUsers';
import { adminBorrowers } from 'core/api/borrowers/queries';
import adminProperties from 'core/api/properties/queries/adminProperties';
import { adminOffers } from 'core/api/offers/queries';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { adminContacts } from 'core/api/contacts/queries';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  OFFERS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from '../../../api/constants';

const makeQuery = (query, params, cb) => query.clone(params).fetchOne(cb);

export default {
  [LOANS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminLoans,
      {
        _id,
        $body: {
          anonymous: true,
          name: 1,
          selectedStructure: 1,
          status: 1,
          structures: { wantedLoan: 1, id: 1 },
          user: { name: 1, assignedEmployee: { name: 1 } },
        },
      },
      cb,
    ),
  [USERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminUsers,
      {
        _id,
        $body: {
          $filter: 1,
          assignedEmployee: { name: 1 },
          email: 1,
          loans: { name: 1 },
          name: 1,
          phoneNumber: 1,
          roles: 1,
        },
      },
      cb,
    ),
  [BORROWERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminBorrowers,
      {
        _id,
        $body: {
          loans: { name: 1 },
          name: 1,
          user: { name: 1, assignedEmployee: { name: 1 } },
        },
      },
      cb,
    ),
  [PROPERTIES_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminProperties,
      {
        _id,
        $body: {
          address1: 1,
          category: 1,
          documents: { propertyImages: 1 },
          name: 1,
          status: 1,
          totalValue: 1,
        },
      },
      cb,
    ),
  [OFFERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminOffers,
      {
        _id,
        $body: {
          feedback: 1,
          lender: { organisation: { name: 1, logo: 1 }, loan: { name: 1 } },
          maxAmount: 1,
        },
      },
      cb,
    ),
  [PROMOTIONS_COLLECTION]: (_id, cb) =>
    makeQuery(
      proPromotion,
      {
        _id,
        $body: {
          availablePromotionLots: 1,
          bookedPromotionLots: 1,
          documents: { promotionImage: 1 },
          lenderOrganisation: { name: 1 },
          name: 1,
          soldPromotionLots: 1,
          status: 1,
        },
      },
      cb,
    ),
  [ORGANISATIONS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminOrganisations,
      {
        _id,
        $body: { name: 1, logo: 1, type: 1, offerCount: 1 },
      },
      cb,
    ),
  [CONTACTS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminContacts,
      {
        _id,
        $body: {
          email: 1,
          name: 1,
          organisations: { name: 1, logo: 1 },
          phoneNumber: 1,
        },
      },
      cb,
    ),
};
