import { Meteor } from 'meteor/meteor';

import UserService from '../../users/server/UserService';

export const getProLoanFilters = ({
  filters,
  userId,
  referredByMe,
  referredByMyOrganisation,
}) => {
  let referralMatchers = [];

  if (referredByMe) {
    referralMatchers = [
      { 'userCache.referredByUserLink': userId },
      { referralId: userId },
    ];
  }

  if (referredByMyOrganisation) {
    const { organisation: mainOrg, users } = UserService.getMainUsersOfOrg({
      userId,
    });
    if (!mainOrg) {
      throw new Meteor.Error('You do not have a main org');
    }
    const { _id: orgId } = mainOrg;
    const includeUserIds = users
      .filter(({ $metadata }) => $metadata.shareCustomers)
      .map(({ _id }) => _id);
    const excludeUserIds = users
      .filter(({ $metadata }) => !$metadata.shareCustomers)
      .map(({ _id }) => _id);

    referralMatchers = [
      { 'userCache.referredByUserLink': { $in: includeUserIds } },
      { 'userCache.referredByOrganisationLink': orgId },
      { referralId: { $in: [orgId, ...includeUserIds] } },
    ];
    filters['userCache.referredByUserLink'] = { $nin: excludeUserIds };
    filters.referralId = { $nin: excludeUserIds };
  }

  filters.$or = referralMatchers;
};
