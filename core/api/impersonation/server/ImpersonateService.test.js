import ImpersonateService from './ImpersonateService';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import { expect } from 'chai';

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

describe('ImpersonateService', function() {
  it('Should be able to authenticate a user as an admin', function(done) {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: ROLES.ADMIN,
        'services.resume.loginTokens': [
          {
            hashedToken: HASHED_TOKEN,
          },
        ],
      },
    });

    ImpersonateService.impersonate(
      {
        setUserId(impersonateId) {
          expect(userId).to.equal(impersonateId);
          done();
        },
      },
      FICTIONAL_TOKEN,
      userId,
    );

    Users.remove({
      _id: { $in: [adminId, userId] },
    });
  });

  it('Should not allow impersonation of a user that is non-dev or non-admin', function() {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: ROLES.LENDER,
        'services.resume.loginTokens': [
          {
            hashedToken: HASHED_TOKEN,
          },
        ],
      },
    });

    expect(function() {
      ImpersonateService.impersonate(
        {
          setUserId(impersonateId) {},
        },
        FICTIONAL_TOKEN,
        userId,
      );
    }).to.throw(Meteor.Error);

    Users.remove({
      _id: { $in: [adminId, userId] },
    });
  });

  it('Should not allow impersonation with invalid token', function() {
    const { adminId, userId } = getDummies();

    const FICTIONAL_TOKEN = Random.id();
    const HASHED_TOKEN = Accounts._hashLoginToken(FICTIONAL_TOKEN);

    Users.update(adminId, {
      $set: {
        roles: ROLES.ADMIN,
        'services.resume.loginTokens': [
          {
            hashedToken: HASHED_TOKEN,
          },
        ],
      },
    });

    expect(function() {
      ImpersonateService.impersonate(
        {
          setUserId(impersonateId) {
            done('Should not be here!');
          },
        },
        FICTIONAL_TOKEN + 'HACKER!',
        userId,
      );
    }).to.throw(Meteor.Error);

    Users.remove({
      _id: { $in: [adminId, userId] },
    });
  });
});
