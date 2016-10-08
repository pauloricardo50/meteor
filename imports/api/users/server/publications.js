import { Meteor } from 'meteor/meteor';
// import { Roles } from 'meteor/alanning:roles'


Meteor.publish('allUsers', function() {
    // Verify if the current user is an admin

    // TODO: Rewrite this without the roles package

    // if (Roles.userIsInRole(this.userId, 'admin')) {
    //     // Return all users
    //     return Meteor.users.find();
    // } else {
    //     return [];
    // }
});
