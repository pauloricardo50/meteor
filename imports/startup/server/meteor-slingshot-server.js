import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import LoanRequests from '/imports/api/loanrequests/loanrequests';

import '../meteor-slingshot';

Slingshot.createDirective('myFileUploads', Slingshot.S3Storage, {
  authorize() {
    // Don't use arrow function, this is the current object here
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(
        'Login Required',
        'Please login before uploading files',
      );
    }

    return true;
  },
  key(file, props) {
    // Store file into a directory by the user's username.
    const request = LoanRequests.findOne({
      userId: this.userId,
      active: true,
    });
    if (!request) {
      throw new Meteor.Error(
        'Loan Request Not Found',
        'No active request could be found for this user',
      );
    }

    // prefix file name with the number of the file
    let fileCount = '00';
    if (props.currentValue) {
      const newCount = Math.max(...props.currentValue.map(f => f.fileCount)) +
        1;
      fileCount = newCount < 10 ? `0${newCount}` : newCount;
    }

    return `${request._id}/${props.folderName}/${fileCount}${file.name}`;
  },
});
