import { Migrations } from 'meteor/percolate:migrations';

import UserService from '../../users/server/UserService';

export const up = () => {
  const allUsers = UserService.fetch({ organisations: { _id: 1 } });

  return Promise.all(allUsers.map(({ _id: userId, organisations = [] }) =>
    organisations.forEach(({ _id: organisationId, $metadata: metadata }) =>
      UserService.updateLinkMetadata({
        id: userId,
        linkName: 'organisations',
        linkId: organisationId,
        metadata: { ...metadata, shareCustomers: true },
      }))));
};

export const down = () => {
  const allUsers = UserService.fetch({ organisations: { _id: 1 } });

  return Promise.all(allUsers.map(({ _id: userId, organisations = [] }) =>
    organisations.forEach(({ _id: organisationId, $metadata: metadata }) => {
      const { shareCustomers, ...restMeta } = metadata;
      UserService.updateLinkMetadata({
        id: userId,
        linkName: 'organisations',
        linkId: organisationId,
        metadata: { shareCustomers: undefined, ...restMeta },
      });
    })));
};

Migrations.add({
  version: 12,
  name: 'Share customers with organisation users',
  up,
  down,
});
