import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';

import StubCollections from 'meteor/hwillson:stub-collections';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import getMountedComponent from './getMountedComponent';

// This has to be imported here for client side tests to use factories
// Because each test using factories also uses stubCollections
import '../../api/factories';

import { Loans, Borrowers, Properties, Offers, Tasks, Users } from '../../api';

/**
 * Unknown - Resets the component, to be called in beforeEach hooks
 *
 * @return {type} undefined
 */
getMountedComponent.reset = (useStubs = true) => {
  getMountedComponent.mountedComponent = undefined;
  if (useStubs) {
    StubCollections.restore();
    StubCollections.stub([Loans, Borrowers, Offers, Meteor.users]);
  }
};

export { getMountedComponent };

/**
 * stubCollections - Stubs collections, for tests using Factory package
 * on the client, no frills attached
 *
 * @return {type} undefined
 */
export const stubCollections = () => {
  StubCollections.stub([
    Meteor.users,
    Loans,
    Borrowers,
    Offers,
    Properties,
    Tasks,
  ]);
};

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

/**
 * getMethodHandler - Returns the method's handler function from inside Meteor
 *
 * @param {string} name  The name of the method
 *
 * @return {function} the method's handler function
 */
export const getMethodHandler = name =>
  Meteor.default_server.method_handlers[name];

stubCollections.restore = () => {
  StubCollections.restore();
};

if (Meteor.isTest) {
  // This is some test initialization, stubbing all the collections here,
  // avoids all timeouts coming later due to us using this function.
  console.log('Initializing Tests...');
  resetDatabase();
  StubCollections.add([
    Meteor.users,
    Loans,
    Borrowers,
    Offers,
    Properties,
    Tasks,
  ]);
  StubCollections.stub(); // This part is critical, need to stub once beforeAll
  stubCollections.restore();

  console.log('Ready to roll');
}
