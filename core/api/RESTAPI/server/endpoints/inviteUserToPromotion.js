import { Meteor } from 'meteor/meteor';

import { proInviteUser } from '../../../methods';
import {
  withMeteorUserId,
  literalToString,
  stringToLiteral,
  updateCustomerReferral,
} from '../helpers';
import { checkQuery, impersonateSchema } from './helpers';

const inviteUserToPromotionAPI = ({
  user: { _id: userId },
  body,
  params,
  query,
}) => {
  const { user, shareSolvency, invitationNote } = body;
  const { promotionId } = params;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  const promotionIds = [promotionId]
    .map(stringToLiteral)
    .filter(x => x)
    .map(literalToString);

  if (!promotionIds.length) {
    throw new Meteor.Error('No promotionId provided');
  }

  return withMeteorUserId({ userId, impersonateUser }, () =>
    proInviteUser.run({
      promotionIds,
      user: { ...user, invitedBy: userId },
      shareSolvency,
      invitationNote,
    }))
    .then(() =>
      updateCustomerReferral({ customer: user, userId, impersonateUser }))
    .then(() => ({
      message: `Successfully invited user "${user.email}" to promotion id "${promotionId}"`,
    }));
};

export default inviteUserToPromotionAPI;
