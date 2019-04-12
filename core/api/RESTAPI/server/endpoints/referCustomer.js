import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { getInvitedByUserId } from './helpers';

const referCustomerAPI = ({ user: { _id: userId }, body }) => {
  const { user, referredBy } = body;

  let proId;
  if (referredBy) {
    proId = getInvitedByUserId({ userId, referredBy });
  }

  return withMeteorUserId(proId || userId, () =>
    proInviteUser.run({
      user: { ...user, invitedBy: userId },
    })).then(() => ({
    message: `Successfully referred user "${user.email}"`,
  }));
};

export default referCustomerAPI;
