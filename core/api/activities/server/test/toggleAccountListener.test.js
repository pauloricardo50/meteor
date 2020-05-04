import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import generator from '../../../factories/server';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { toggleAccount } from '../../../users/methodDefinitions';
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
    const { activities = [] } = UserService.get('user', {
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
