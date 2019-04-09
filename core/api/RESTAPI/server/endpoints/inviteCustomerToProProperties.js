import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const formatPropertyIds = (propertyIds) => {
  const ids = propertyIds.map(id => `"${id}"`);
  return [ids.slice(0, -1).join(', '), ids.slice(-1)[0]].join(ids.length < 2 ? '' : ' and ');
};

const inviteCustomerToProPropertiesAPI = ({ user: { _id: userId }, body }) => {
  const { user, propertyIds } = body;
  const formattedIds = formatPropertyIds(propertyIds);

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
