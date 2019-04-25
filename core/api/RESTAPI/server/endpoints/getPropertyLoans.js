import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

import proPropertyLoans from '../../../loans/queries/proPropertyLoans';
import { getImpersonateUserId, checkQuery } from './helpers';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const getPropertyLoansAPI = ({ user: { _id: userId }, params, query }) => {
  const { propertyId } = params;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  });

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const loans = proPropertyLoans
    .clone({ propertyId })
    .fetch({ userId: proId || userId });

  const filteredLoans = loans.map(loan =>
    pick(loan, [
      'user.name',
      'user.phoneNumbers',
      'user.email',
      'user.referredByUser.name',
      'user.referredByOrganisation.name',
      'createdAt',
      'name',
      'loanProgress',
      'status',
      'properties',
    ]));

  return filteredLoans.map(({ properties, ...loan }) => {
    const property = properties.find(({ _id }) => _id === propertyId) || {};
    const { solvent } = property;
    return { ...loan, solvent };
  });
};

export default getPropertyLoansAPI;
