import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

import PropertyService from 'core/api/properties/server/PropertyService';
import { proPropertyLoans } from '../../../loans/queries';
import { getImpersonateUserId, checkQuery } from './helpers';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const getPropertyLoansAPI = ({ user: { _id: userId }, params, query }) => {
  let { propertyId } = params;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  });

  const exists = PropertyService.exists(propertyId);

  if (!exists) {
    const propertyByExternalId = PropertyService.get(
      { externalId: propertyId },
      { _id: 1 },
    );
    if (propertyByExternalId) {
      propertyId = propertyByExternalId._id;
    }
  }

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const loans = proPropertyLoans
    .clone({
      propertyId,
      $body: {
        user: {
          name: 1,
          phoneNumbers: 1,
          email: 1,
          referredByUser: { name: 1 },
          referredByOrganisation: { name: 1 },
        },
        createdAt: 1,
        name: 1,
        status: 1,
        properties: { category: 1 },
        proNotes: 1,
        residenceType: 1,
        anonymous: 1,
        shareSolvency: 1,
        // Used for the property solvency calculation
        maxPropertyValue: 1,
      },
    })
    .fetch({ userId: proId || userId });

  return loans.map(({ properties, maxPropertyValue, userCache, ...loan }) => {
    const property = properties.find(({ _id }) => _id === propertyId) || {};
    const { solvent } = property;
    return { ...loan, solvent };
  });
};

export default getPropertyLoansAPI;
