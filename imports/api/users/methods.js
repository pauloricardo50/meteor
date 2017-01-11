import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';


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
});

Meteor.methods({
  doesUserExist(email) {
    check(email, String);
    return Accounts.findUserByEmail(email) != null;
  },
});


// Create a partner User
export const createPartner = new ValidatedMethod({
  name: 'users.createPartner',
  validate({ options }) {
  },
  run({ options }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
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
