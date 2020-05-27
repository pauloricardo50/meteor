import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import {
  getUserNameAndOrganisation,
  getUserOrganisationName,
} from 'core/api/helpers';
import { setUserReferredBy } from 'core/api/users/methodDefinitions';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';

const getMenuItems = ({ proUsers, referredByUser, userId, name }) =>
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
      show: proId !== referredByUser?._id,
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
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.PRO },
      name: 1,
      organisations: { name: 1 },
      $options: { sort: { lastName: 1 } },
    },
    queryOptions: { reactive: false },
    dataName: 'proUsers',
    refetchOnMethodCall: false,
    smallLoader: true,
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
