import { Meteor } from 'meteor/meteor';
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

    console.log(Roles.userIsInRole(this.userId, 'admin'));

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
