import { Migrations } from 'meteor/percolate:migrations';

import UserService from '../../users/server/UserService';
import { ACQUISITION_CHANNELS } from '../../users/userConstants';

export const up = () => {
  const users = UserService.fetch({
    $filters: {
      referredByOrganisationLink: { $exists: true },
      referredByUserLink: { $exists: false },
    },
    _id: 1,
  });

  return Promise.all(
    users.map(({ _id }) =>
      UserService.rawCollection.update(
        { _id },
        { $set: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_ORGANIC } },
      ),
    ),
  );
};

export const down = () => {
  const users = UserService.fetch({
    $filters: {
      referredByOrganisationLink: { $exists: true },
      referredByUserLink: { $exists: false },
    },
    _id: 1,
  });

  return Promise.all(
    users.map(({ _id }) =>
      UserService.rawCollection.update(
        { _id },
        { $set: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_PRO } },
      ),
    ),
  );
};

Migrations.add({
  version: 36,
  name: 'Add referral organic acquisition channel',
  up,
  down,
});
