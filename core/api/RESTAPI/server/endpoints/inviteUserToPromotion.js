import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const paramsSchema = new SimpleSchema({
  promotionId: { type: String, optional: false },
});

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const inviteUserToPromotionAPI = ({
  user: { _id: userId },
  body,
  params,
  query,
}) => {
  const { user } = body;
  const cleanParams = paramsSchema.clean(params);
  const cleanQuery = querySchema.clean(query);
  try {
    paramsSchema.validate(cleanParams);
    querySchema.validate(cleanQuery);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  const { promotionId } = cleanParams;
  const impersonateUser = cleanQuery['impersonate-user']; // TODO: implement this

  return withMeteorUserId(userId, () =>
    proInviteUser.run({
      promotionIds: [promotionId].filter(x => x),
      user: { ...user, invitedBy: userId },
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to promotion id "${promotionId}"`,
  }));
};

export default inviteUserToPromotionAPI;
