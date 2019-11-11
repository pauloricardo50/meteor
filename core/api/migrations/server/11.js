import { Migrations } from 'meteor/percolate:migrations';

import UserService from '../../users/server/UserService';

export const up = () => {
  const allUsers = UserService.fetch({ organisations: { _id: 1 } });

  return Promise.all(
    allUsers.map(({ _id: userId, organisations = [] }) =>
      organisations.forEach(
        ({ _id: organisationId, $metadata: metadata }, index) =>
          UserService.updateLinkMetadata({
            id: userId,
            linkName: 'organisations',
            linkId: organisationId,
            metadata: { ...metadata, isMain: index === 0 },
          }),
      ),
    ),
  );
};

export const down = () => {
  const allUsers = UserService.fetch({ organisations: { _id: 1 } });

  return Promise.all(
    allUsers.map(({ _id: userId, organisations = [] }) =>
      organisations.forEach(({ _id: organisationId, $metadata: metadata }) => {
        const { isMain, ...restMeta } = metadata;
        UserService.updateLinkMetadata({
          id: userId,
          linkName: 'organisations',
          linkId: organisationId,
          metadata: { isMain: undefined, ...restMeta },
        });
      }),
    ),
  );
};

Migrations.add({
  version: 11,
  name: 'Set first organisation as main',
  up,
  down,
});
