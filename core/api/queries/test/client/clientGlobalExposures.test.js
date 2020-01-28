import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

import { userLogin, resetDatabase } from 'core/utils/testHelpers/index';
import { ROLES } from 'core/api/users/userConstants';

describe('Global Exposures', () => {
  beforeEach(() => {
    resetDatabase();
  });

  afterEach(done =>
    Meteor.logout(err => {
      done(err);
    }),
  );

  it('can fetch data with a custom fragment', async () => {
    await userLogin({ role: ROLES.ADMIN });
    const user = await new Promise((resolve, reject) =>
      createQuery({ users: { emails: 1 } }).fetchOne((err, res) =>
        err ? reject(err) : resolve(res),
      ),
    );
    expect(user.emails.length).to.equal(1);
  });

  it('can fetch data with a custom fragment containing filters', async () => {
    await userLogin({ role: ROLES.ADMIN, email: 'test@e-potek.ch' });
    const user = await new Promise((resolve, reject) =>
      createQuery({
        users: { emails: 1, $filters: { 'emails.address': 'test@e-potek.ch' } },
      }).fetchOne((err, res) => (err ? reject(err) : resolve(res))),
    );
    expect(user).to.not.equal(undefined);
  });

  it('cannot fetch data when user is not an admin', async () => {
    await userLogin({ role: ROLES.USER });
    try {
      const user = await new Promise((resolve, reject) =>
        createQuery({ users: { emails: 1 } }).fetchOne((err, res) =>
          err ? reject(err) : resolve(res),
        ),
      );
      expect(1).to.equal(2, 'Should throw');
    } catch (error) {
      expect(error.message).to.include('NOT_AUTHORIZED');
    }
  });
});
