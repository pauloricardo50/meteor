import { compose, withProps } from 'recompose';

import { setUserReferredBy } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit';
import {
  getUserNameAndOrganisation,
  getUserOrganisationName,
} from 'core/api/helpers';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/users/userConstants';

const getMenuItems = ({
  proUsers,
  referredByUser: { referredByUserId } = {},
  userId,
  name,
}) =>
  [null, ...proUsers].map(pro => {
    const { _id: proId } = pro || {};
    let userName = 'Personne';
    let organisationName;
    if (proId) {
      userName = getUserNameAndOrganisation({ user: pro });
      organisationName = getUserOrganisationName({ user: pro });
    }
    return {
      id: proId,
      show: proId !== referredByUserId,
      label: userName,
      link: false,
      onClick: () => {
        let confirmMessage = `Retirer le referral de ${name} ?`;
        if (proId) {
          confirmMessage = `Changer le referral de ${name} à ${userName} ?`;
          confirmMessage = organisationName
            ? `${confirmMessage} Attention: cela changera également son organisation referral à ${organisationName}.`
            : `${confirmMessage} Attention: ${name} n'aura plus d'organisation referral.`;
        }
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
      $body: {
        name: 1,
        organisations: { name: 1 },
        $options: { sort: { name: 1 } },
      },
    },
    queryOptions: { reactive: false },
    dataName: 'proUsers',
  }),
  withProps(
    ({ proUsers = [], user: { _id: userId, referredByUser, name } }) => ({
      options: getMenuItems({
        proUsers: proUsers.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        referredByUser,
        userId,
        name,
      }),
      referredByUser,
    }),
  ),
);
