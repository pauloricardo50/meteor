import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';

import faker from 'faker';

import { Users, testUserAccount } from '../../api';
import { ROLES } from '../../api/constants';

/**
 * createLoginToken - Generate & saves a login token on the user with the given id
 *
 * @param {string} userId  A Meteor user id
 *
 * @return {string} the generated login token
 */
export const createLoginToken = (userId) => {
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
      .then(user =>
        new Promise((resolve, reject) => {
          Meteor.loginWithPassword({ id: user._id }, userPassword, err =>
            (err ? reject(err) : resolve(user)));
        }));
  }
};

export const checkEmails = (expected, options = {}) =>
  new Promise((resolve, reject) => {
    Meteor.call('getAllTestEmails', { expected, ...options }, (err, emails) =>
      (err ? reject(err) : resolve(emails)));
  });
