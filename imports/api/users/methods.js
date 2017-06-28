import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import rateLimit from '/imports/js/helpers/rate-limit.js';

Meteor.methods({
  toggleAdmin(id) {
    check(id, String);

    // Verify that user is logged in and is an admin
    // if (!this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // } else if (!Roles.userIsInRole(this.userId, 'admin')) {
    //   throw new Meteor.Error('not-authorized');
    // }

    if (Roles.userIsInRole(id, 'admin')) {
      Roles.removeUsersFromRoles(id, 'admin');
    } else {
      Roles.addUsersToRoles(id, 'admin');
    }
  },
  doesUserExist(email) {
    check(email, String);
    if (Meteor.isServer) {
      return Accounts.findUserByEmail(email) != null;
    }

    return undefined;
  },
  sendVerificationLink(userId) {
    console.log('yayaya');
    check(userId, Match.Optional(String));

    const id = userId || Meteor.userId();
    if (id) {
      return Accounts.sendVerificationEmail(id);
    } else {
      throw new Meteor.Error('no userId for verification email');
    }
  },
});

// Create a partner User
export const createPartner = new ValidatedMethod({
  name: 'users.createPartner',
  validate({ options }) {},
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

rateLimit({
  methods: [
    'toggleAdmin',
    'doesUserExist',
    'sendVerificationLink',
    createPartner,
  ],
});
