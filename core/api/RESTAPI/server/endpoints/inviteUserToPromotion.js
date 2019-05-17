import { Meteor } from 'meteor/meteor';

import { proInviteUser } from '../../../methods';
import { withMeteorUserId, literalToString, stringToLiteral } from '../helpers';
import { checkQuery, impersonateSchema } from './helpers';

const inviteUserToPromotionAPI = ({
  user: { _id: userId },
  body,
  params,
  query,
}) => {
  const { user, shareSolvency } = body;
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

  return withMeteorUserId(userId, () =>
    proInviteUser.run({
      promotionIds,
      user: { ...user, invitedBy: userId },
      shareSolvency,
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to promotion id "${promotionId}"`,
  }));
};

export default inviteUserToPromotionAPI;
