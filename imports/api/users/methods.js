import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import rateLimit from '/imports/js/helpers/rate-limit.js';

Meteor.methods({
  doesUserExist(email) {
    check(email, String);
    if (Meteor.isServer) {
      // This should remain a simple inequality check
      return Accounts.findUserByEmail(email) != null;
    }

    return undefined;
  },
  sendVerificationLink(userId) {
    check(userId, Match.Optional(String));

    if (!this.isSimulation) {
      const id = userId || Meteor.userId();
      if (id) {
        return Accounts.sendVerificationEmail(id);
      }
      throw new Meteor.Error('no userId for verification email');
    } else {
      return undefined;
    }
  },
});

// Create a partner User
export const createPartner = new ValidatedMethod({
  name: 'users.createPartner',
  validate({ options }) {
    check(options, Object);
  },
  run({ options }) {
    if (!this.userId) {
      throw new Meteor.Error(
        'notLoggedIn',
        'Must be logged in to update a request',
      );
    }
    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error('notAdmin', 'Must be an Admin to do this');
    }

    // Create User
    const id = Accounts.createUser(options);
    // id won't exist on client, so check if it exists (which it will on the server), and make
    // it a partner
    // TODO: Send an enrollment email to the specified email address
    if (id) {
      Roles.addUsersToRoles(id, 'partner');
      // Accounts.sendEnrollmentEmail(id, options.email);
    }
  },
});

export const createUser = new ValidatedMethod({
  name: 'users.create',
  validate({ options }) {
    check(options, Object);
    check(options.email, String);
    check(options.password, String);
  },
  run({ options }) {},
});

rateLimit({
  methods: [
    'toggleAdmin',
    'doesUserExist',
    'sendVerificationLink',
    createPartner,
  ],
});
