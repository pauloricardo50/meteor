import { Meteor } from 'meteor/meteor';
import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

import { expect } from 'chai';

import {
  generateScenario,
  resetDatabase,
  userLogin,
} from '../../../../utils/testHelpers';
import { ROLES } from '../../../users/userConstants';

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
      await new Promise((resolve, reject) =>
        createQuery({ users: { emails: 1 } }).fetchOne((err, res) =>
          err ? reject(err) : resolve(res),
        ),
      );
      expect(1).to.equal(2, 'Should throw');
    } catch (error) {
      expect(error.message).to.include('NOT_AUTHORIZED');
    }
  });

  it('returns transformed data', async () => {
    const { _id: userId } = await userLogin({ role: ROLES.ADMIN });
    await generateScenario({
      loans: { user: { _id: userId } },
    });

    const user = await new Promise((resolve, reject) =>
      createQuery({
        users: { loans: { _id: 1 } },
      }).fetchOne((err, res) => (err ? reject(err) : resolve(res))),
    );

    expect(user._collection).to.equal('users');
    // FIXME: This should work
    // expect(user.loans[0]._collection).to.equal('loans')
  });
});
