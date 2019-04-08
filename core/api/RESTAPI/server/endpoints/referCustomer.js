import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const referCustomerAPI = ({ user: { _id: userId }, body }) => {
  const { user } = body;

  return withMeteorUserId(userId, () =>
    proInviteUser.run({
      user: { ...user, invitedBy: userId },
    })).then(() => ({
    message: `Successfully referred user "${user.email}"`,
  }));
};

export default referCustomerAPI;
