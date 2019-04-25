import { Meteor } from 'meteor/meteor';
import pick from 'lodash/pick';
import SimpleSchema from 'simpl-schema';

import proPropertyLoans from '../../../loans/queries/proPropertyLoans';
import { getImpersonateUserId } from './helpers';

const paramsSchema = new SimpleSchema({
  propertyId: { type: String, optional: false },
});

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const getPropertyLoansAPI = ({ user: { _id: userId }, params, query }) => {
  const cleanParams = paramsSchema.clean(params);
  const cleanQuery = querySchema.clean(query);
  try {
    paramsSchema.validate(cleanParams);
    querySchema.validate(cleanQuery);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  const { propertyId } = cleanParams;
  const impersonateUser = cleanQuery['impersonate-user'];

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
