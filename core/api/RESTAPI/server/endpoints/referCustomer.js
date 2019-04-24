import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { getImpersonateUserId } from './helpers';

const referCustomerAPI = ({ user: { _id: userId }, body, query }) => {
  const { user, shareSolvency = false } = body;
  const { impersonateUser } = query;

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  return withMeteorUserId(proId || userId, () =>
    proInviteUser.run({
      user: { ...user, invitedBy: userId },
      shareSolvency,
    })).then(() => ({
    message: `Successfully referred user "${user.email}"`,
  }));
};

export default referCustomerAPI;
