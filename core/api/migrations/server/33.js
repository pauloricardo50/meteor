import { Migrations } from 'meteor/percolate:migrations';

import UserService from '../../users/server/UserService';
import { ROLES, ACQUISITION_CHANNELS } from '../../users/userConstants';

export const up = () => {
  const users = UserService.fetch({
    $filters: {
      $or: [
        { referredByUserLink: { $exists: true } },
        { referredByOrganisationLink: { $exists: true } },
      ],
    },
    referredByUser: { _id: 1, roles: 1 },
    referredByOrganisation: { _id: 1 },
  });

  return Promise.all(
    users.map(({ _id, referredByUser, referredByOrganisation }) => {
      if (referredByUser) {
        return UserService.rawCollection.update(
          { _id },
          {
            $set: {
              acquisitionChannel: referredByUser.roles.includes(ROLES.ADMIN)
                ? ACQUISITION_CHANNELS.REFERRAL_ADMIN
                : ACQUISITION_CHANNELS.REFERRAL_PRO,
            },
          },
        );
      }

      if (referredByOrganisation) {
        return UserService.rawCollection.update(
          { _id },
          {
            $set: {
              acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_PRO,
            },
          },
        );
      }

      return Promise.resolve();
    }),
  );
};

export const down = () =>
  UserService.rawCollection.update(
    {},
    { $unset: { acquisitionChannel: true } },
    { multi: true },
  );

Migrations.add({
  version: 33,
  name: 'Add acquisition channel on users',
  up,
  down,
});
