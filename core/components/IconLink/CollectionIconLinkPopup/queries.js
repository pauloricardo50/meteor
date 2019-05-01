import adminLoan from 'core/api/loans/queries/adminLoan';
import adminUser from 'core/api/users/queries/adminUser';
import adminBorrower from 'core/api/borrowers/queries/adminBorrower';
import adminProperty from 'core/api/properties/queries/adminProperty';
import adminOffer from 'core/api/offers/queries/adminOffer';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import adminOrganisation from 'core/api/organisations/queries/adminOrganisation';
import contacts from 'core/api/contacts/queries/contacts';
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
    makeQuery(adminLoan, { loanId: _id, $body: { name: 1, status: 1 } }, cb),
  [USERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminUser,
      { _id, $body: { $filter: 1, name: 1, loans: { name: 1 }, roles: 1 } },
      cb,
    ),

  [BORROWERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminBorrower,
      { _id, $body: { name: 1, loans: { name: 1 }, user: { name: 1 } } },
      cb,
    ),
  [PROPERTIES_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminProperty,
      {
        propertyId: _id,
        $body: {
          address: 1,
          category: 1,
          totalValue: 1,
          documents: { propertyImages: 1 },
        },
      },
      cb,
    ),
  [OFFERS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminOffer,
      {
        _id,
        $body: {
          lender: { organisation: { name: 1, logo: 1 } },
        },
      },
      cb,
    ),
  [PROMOTIONS_COLLECTION]: (_id, cb) =>
    makeQuery(
      proPromotion,
      {
        promotionId: _id,
        $body: {
          name: 1,
          status: 1,
          availablePromotionLots: 1,
          bookedPromotionLots: 1,
          soldPromotionLots: 1,
          documents: { promotionImage: 1 },
        },
      },
      cb,
    ),
  [ORGANISATIONS_COLLECTION]: (_id, cb) =>
    makeQuery(
      adminOrganisation,
      {
        organisationId: _id,
        $body: { name: 1, logo: 1, type: 1 },
      },
      cb,
    ),
  [CONTACTS_COLLECTION]: (_id, cb) =>
    makeQuery(
      contacts,
      {
        _id,
        $body: { name: 1, organisations: { name: 1, logo: 1 } },
      },
      cb,
    ),
};
