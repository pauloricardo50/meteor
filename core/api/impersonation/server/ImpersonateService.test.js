/* eslint-env mocha */
import { expect } from 'chai';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import ImpersonateService from './ImpersonateService';

function getDummies() {
  const adminId = Accounts.createUser({
    email: 'impersonator@epotek.ch',
    password: '12345',
  });

  const userId = Accounts.createUser({
    email: 'sheep@epotek.ch',
    password: '12345',
  });

  return { adminId, userId };
}

describe('ImpersonateService', () => {
  it('Should be able to authenticate a user as an admin', (done) => {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    console.log('test! hash', HASHED_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: ROLES.ADMIN,
        'services.resume.loginTokens': [{ hashedToken: HASHED_TOKEN }],
      },
    });

    ImpersonateService.impersonate({
      context: {
        setUserId(impersonateId) {
          expect(userId).to.equal(impersonateId);
          done();
        },
      },
      authToken: FICTIONAL_TOKEN,
      userIdToImpersonate: userId,
    });

    Users.remove({ _id: { $in: [adminId, userId] } });
  });

  it('Should not allow impersonation of a user that is non-dev or non-admin', () => {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: ROLES.LENDER,
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
        roles: ROLES.ADMIN,
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
