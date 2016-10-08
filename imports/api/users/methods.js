import { Meteor } from 'meteor/meteor';

Meteor.methods({
    toggleAdmin(id) {
        console.log(id);
        check(id, String);

        // Verify that user is logged in and is an admin

        // TODO: Rewrite this without the roles package, easypeasy

        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized');
        // } else if (!Roles.userIsInRole(this.userId, 'admin')) {
        //     throw new Meteor.Error('not-authorized');
        // }
        //
        // if (Roles.userIsInRole(id, 'admin')) {
        //     Roles.removeUsersFromRoles(id, 'admin');
        // } else {
        //     Roles.addUsersToRoles(id, 'admin');
        // }
    }
});
