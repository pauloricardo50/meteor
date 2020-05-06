import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

/* eslint-env mocha */
import { expect } from 'chai';

import Users from '../../users';
import { ROLES } from '../../users/userConstants';
import ImpersonateService from './ImpersonateService';

function getDummies() {
  const adminId = Accounts.createUser({
    email: 'impersonator@epotek.ch',
    password: '12345678',
  });

  const userId = Accounts.createUser({
    email: 'sheep@epotek.ch',
    password: '12345678',
  });

  return { adminId, userId };
}

describe('ImpersonateService', () => {
  it('Should be able to authenticate a user as an admin', done => {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: [{ _id: ROLES.ADMIN }],
        'services.resume.loginTokens': [{ hashedToken: HASHED_TOKEN }],
      },
    });

    ImpersonateService.impersonate({
      context: {
        setUserId(impersonateId) {
          expect(userId).to.equal(impersonateId);
          Users.remove({ _id: { $in: [adminId, userId] } });
          done();
        },
      },
      authToken: FICTIONAL_TOKEN,
      userIdToImpersonate: userId,
    });
  });

  it('Should not allow impersonation of a user that is non-dev or non-admin', () => {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: [{ _id: ROLES.PRO }],
        'services.resume.loginTokens': [{ hashedToken: HASHED_TOKEN }],
      },
    });

    expect(() => {
      ImpersonateService.impersonate({
        context: {
          setUserId(impersonateId) {},
        },
        authToken: FICTIONAL_TOKEN,
        userIdToImpersonate: userId,
      });
    }).to.throw(Meteor.Error);

    Users.remove({ _id: { $in: [adminId, userId] } });
  });

  it('Should not allow impersonation with invalid token', () => {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: [{ _id: ROLES.ADMIN }],
        'services.resume.loginTokens': [{ hashedToken: HASHED_TOKEN }],
      },
    });

    expect(() => {
      ImpersonateService.impersonate({
        context: {
          setUserId(impersonateId) {
            done('Should not be here!');
          },
        },
        authToken: `${FICTIONAL_TOKEN}HACKER!`,
        userIdToImpersonate: userId,
      });
    }).to.throw(Meteor.Error);

    Users.remove({ _id: { $in: [adminId, userId] } });
  });
});
