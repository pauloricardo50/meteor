import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import { expect } from 'chai';
import faker from 'faker';
import sinon from 'sinon';

import { testUserAccount } from '../../api/users/methodDefinitions';
import { ROLES } from '../../api/users/userConstants';
import Users from '../../api/users/users';

/**
 * createLoginToken - Generate & saves a login token on the user with the given id
 *
 * @param {string} userId  A Meteor user id
 *
 * @return {string} the generated login token
 */
export const createLoginToken = userId => {
  const loginToken = Random.id();
  const hashedToken = Accounts._hashLoginToken(loginToken);

  Users.update(userId, {
    $set: {
      'services.resume.loginTokens': [{ hashedToken }],
    },
  });

  return loginToken;
};

/**
 * createEmailVerificationToken - Generate & saves a email verification token on the user with the given id
 *
 * @param {string} userId  A Meteor user id
 * @param {string} email  The email to be verified
 *
 * @return {string} the generated token
 */
export const createEmailVerificationToken = (userId, email) => {
  const token = Random.id();

  Users.update(
    { _id: userId },
    {
      $push: {
        'services.email.verificationTokens': {
          // token has to be uniq in the Users collection
          token,
          address: email,
          when: new Date(),
        },
      },
    },
  );

  return token;
};

export const userLogin = ({ email, password, role }) => {
  const userEmail = email || faker.internet.email();
  const userPassword = password || faker.random.word();

  if (Meteor.isServer) {
    const user = testUserAccount.run({
      email: userEmail,
      password: userPassword,
      role: role || ROLES.USER,
    });
    Meteor.loginWithPassword({ id: user._id }, userPassword);
    return Promise.resolve(user);
  }

  if (Meteor.isClient) {
    return testUserAccount
      .run({
        email: userEmail,
        password: userPassword,
        role: role || ROLES.USER,
      })
      .then(
        user =>
          new Promise((resolve, reject) => {
            Meteor.loginWithPassword({ id: user._id }, userPassword, err =>
              err ? reject(err) : resolve(user),
            );
          }),
      );
  }
};

export const checkEmails = (expected, options = {}) =>
  new Promise((resolve, reject) => {
    Meteor.call('getAllTestEmails', { expected, ...options }, (err, emails) => {
      if (err) {
        reject(err);
      }

      try {
        // getAllTestEmails returns when at least `expected` emails are found
        // So it could be more. Make sure we always get exactly what we expect
        if (expected && !options.noExpect) {
          expect(emails.length).to.equal(
            expected,
            `Got: ${
              emails?.length
                ? emails.map(({ emailId }) => emailId).join(', ')
                : 'no email sent'
            }`,
          );
        }
      } catch (error) {
        reject(error);
      }

      resolve(emails);
    });
  });

export const generateScenario = scenario =>
  new Promise((resolve, reject) => {
    Meteor.call('generateScenario', { scenario }, (err, res) =>
      err ? reject(err) : resolve(res),
    );
  });

export const callMethod = (name, ...args) =>
  new Promise(resolve =>
    Meteor.call(name, ...args, (err, res) => resolve(res)),
  );

export const createClock = time =>
  sinon.useFakeTimers({
    now: time,
    shouldAdvanceTime: true,
    // DDP is broken if we fake some of the other timers,
    // even if we always restore the clock after the tests
    // TODO: find the specific timers that cause this
    toFake: ['Date'],
  });

// Method listeners are async
// This function waits for a stub/spy to be called
// If it waited more than 1s it fails
export const waitForStub = (stub, callCount) =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (stub.called && (callCount ? stub.args.length >= callCount : true)) {
        resolve(stub.args);
      } else if (Date.now() > start + 1000) {
        reject(new Error('waitForStub timeout'));
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
