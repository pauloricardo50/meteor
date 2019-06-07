import { withProps, compose } from 'recompose';

import { setUserReferredBy } from 'core/api';
import {
  getUserNameAndOrganisation,
  getUserOrganisationName,
} from 'core/api/helpers';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';

const getMenuItems = ({
  proUsers,
  referredByUser: { referredByUserId } = {},
  userId,
  name,
}) =>
  proUsers.map((pro) => {
    const { _id: proId } = pro;
    const userName = getUserNameAndOrganisation({ user: pro });
    const organisationName = getUserOrganisationName({ user: pro });
    return {
      id: proId,
      show: proId !== referredByUserId,
      label: userName,
      link: false,
      onClick: () => {
        let confirmMessage = `Changer le référent de ${name} à ${userName} ?`;
        confirmMessage = organisationName
          ? `${confirmMessage} Attention: cela changera également son organisation référente à ${organisationName}.`
          : `${confirmMessage} Attention: ${name} n'aura plus d'organisation référente.`;
        const confirm = window.confirm(confirmMessage);
        if (confirm) {
          return setUserReferredBy.run({ userId, proId });
        }

        return Promise.resolve();
      },
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
  withProps(({ proUsers = [], user: { _id: userId, referredByUser, name } }) => ({
    options: getMenuItems({ proUsers, referredByUser, userId, name }),
    referredByUser,
  })),
);
