/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ddpWithUserId } from '../../../methods/server/methodHelpers';
import { toggleAccount } from '../../../methods';

import generator from '../../../factories';
import UserService from '../../../users/server/UserService';

describe('toggleAccountListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        {
          _id: 'admin',
          _factory: 'admin',
          firstName: 'Admin',
          lastName: 'E-Potek',
        },
        {
          _id: 'user',
          _factory: 'user',
        },
      ],
    });
  });

  it('adds activity on the user', async () => {
    await ddpWithUserId('admin', () => toggleAccount.run({ userId: 'user' }));
    await ddpWithUserId('admin', () => toggleAccount.run({ userId: 'user' }));
    const { activities = [] } = UserService.fetchOne({
      $filters: { _id: 'user' },
      activities: { description: 1, title: 1 },
    });
    expect(activities.length).to.equal(2);
    expect(activities[0]).to.deep.include({
      title: 'Compte désactivé',
      description: 'Par Admin E-Potek',
    });
    expect(activities[1]).to.deep.include({
      title: 'Compte activé',
      description: 'Par Admin E-Potek',
    });
  });
});
