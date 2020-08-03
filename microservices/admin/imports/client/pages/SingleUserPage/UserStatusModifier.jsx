import { withProps } from 'recompose';

import { setUserStatus } from 'core/api/users/methodDefinitions';

import StatusModifier from '../../components/StatusModifier';

const UserStatusModifier = withProps(({ user }) => ({
  doc: user,
  method: status =>
    setUserStatus.run({
      userId: user._id,
      status,
      reason: 'Manual change',
      source: 'admin',
    }),
}))(StatusModifier);

export default UserStatusModifier;
