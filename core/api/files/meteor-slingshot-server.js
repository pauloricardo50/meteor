import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';

import Loans from 'core/api/loans/loans';
import Borrowers from 'core/api/borrowers/borrowers';
import { getFileCount } from './fileHelpers';
import './meteor-slingshot';

Slingshot.createDirective('myFileUploads', Slingshot.S3Storage, {
  authorize(file, { collection, docId }) {
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
    if (collection === 'borrowers') {
      const doc = Borrowers.findOne(docId);

      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else if (collection === 'loans') {
      const doc = Loans.findOne(docId);
      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else {
      throw new Meteor.Error('Invalid collection', "Collection doesn't exist");
    }

    return true;
  },
  key(file, { currentValue, docId, id }) {
    const { fileCountString } = getFileCount(currentValue);

    return `${docId}/${id}/${fileCountString}${file.name}`;
  },
});
