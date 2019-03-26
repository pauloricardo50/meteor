import { withProps, compose } from 'recompose';

import { setUserReferredBy } from 'core/api';
import { getUserNameAndOrganisation } from 'core/api/helpers';
import { withSmartQuery } from 'core/api/containerToolkit';
import adminUsers from 'core/api/users/queries/adminUsers';
import { ROLES } from 'core/api/constants';

const getMenuItems = ({
  proUsers,
  referredByUser: { referredByUserId } = {},
  userId,
}) =>
  proUsers.map((pro) => {
    const { _id: proId } = pro;
    const userName = getUserNameAndOrganisation({ user: pro });
    return {
      id: proId,
      show: proId !== referredByUserId,
      label: userName,
      link: false,
      onClick: () => setUserReferredBy.run({ userId, proId }),
    };
  });

export default compose(
  withSmartQuery({
    query: adminUsers,
    params: {
      roles: [ROLES.PRO, ROLES.ADMIN, ROLES.DEV],
      $body: { name: 1, organisations: { name: 1 } },
    },
    queryOptions: { reactive: false },
    dataName: 'proUsers',
  }),
  withProps(({ proUsers = [], user: { _id: userId, referredByUser } }) => ({
    options: getMenuItems({ proUsers, referredByUser, userId }),
    referredByUser,
  })),
);
