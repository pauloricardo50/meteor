import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const inviteCustomerToProPropertyAPI = ({
  user: { _id: userId },
  body,
  params,
}) => {
  const { user } = body;
  const { propertyId } = params;

  return withMeteorUserId(userId, () =>
    proInviteUser.run({
      propertyIds: [propertyId].filter(x => x),
      user,
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to property id "${propertyId}"`,
  }));
};

export default inviteCustomerToProPropertyAPI;
