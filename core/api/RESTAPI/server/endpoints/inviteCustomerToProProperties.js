import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const inviteCustomerToProPropertiesAPI = ({ user: { _id: userId }, body }) => {
  const { user, propertyIds } = body;
  const formattedIds = [
    propertyIds.slice(0, -1).join(', '),
    propertyIds.slice(-1)[0],
  ].join(propertyIds.length < 2 ? '' : ' and ');

  return withMeteorUserId(userId, () =>
    proInviteUser.run({
      propertyIds: propertyIds.filter(x => x),
      user,
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to property ids ${formattedIds}`,
  }));
};

export default inviteCustomerToProPropertiesAPI;
