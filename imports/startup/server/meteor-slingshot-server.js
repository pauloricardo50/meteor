import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import LoanRequests from '/imports/api/loanrequests/loanrequests';

import '../meteor-slingshot';

Slingshot.createDirective('myFileUploads', Slingshot.S3Storage, {
  acl: 'public-read', // Canned ACL from AWS
  authorize() { // Don't use arrow function, this is the current object here
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error('Login Required', 'Please login before posting files');
    }

    return true;
  },

  key(file) {
    // Store file into a directory by the user's username.
    const request = LoanRequests.findOne({
      userId: this.userId,
      active: true,
    });
    if (!request) {
      throw new Meteor.Error('Loan Request Not Found', 'No active request could be found for this user');
    }

    return `${request._id}/${file.name}`;
  },
});
