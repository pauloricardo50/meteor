import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';

import '../meteor-slingshot';

const getFileCount = (props) => {
  let fileCount = '00';
  if (props.currentValue) {
    const newCount = Math.max(...props.currentValue.map(f => f.fileCount)) + 1;
    fileCount = newCount < 10 ? `0${newCount}` : newCount;
  }
  return fileCount;
};

Slingshot.createDirective('myFileUploads', Slingshot.S3Storage, {
  authorize(file, props) {
    // Don't use arrow function, this is the current object here

    // Check for devs and admins
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'dev')
    ) {
      return true;
    }

    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(
        'Login Required',
        'Please login before uploading files',
      );
    }

    // Make sure this user is the owner of the document
    if (props.collection === 'borrowers') {
      const doc = Borrowers.findOne(props.documentId);

      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else if (props.collection === 'loanRequests') {
      const doc = LoanRequests.findOne(props.documentId);
      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else {
      throw new Meteor.Error('Invalid collection', "Collection doesn't exist");
    }

    return true;
  },
  key(file, props) {
    return `${props.documentId}/${props.id}/${getFileCount(props)}${file.name}`;
  },
});
