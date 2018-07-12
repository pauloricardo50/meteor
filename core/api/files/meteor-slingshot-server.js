import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';

import { Loans, Properties, Borrowers } from '..';
import {
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
} from '../constants';
import { getUploadCountPrefix } from './fileHelpers';
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
    if (collection === BORROWERS_COLLECTION) {
      const doc = Borrowers.findOne(docId);

      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else if (collection === LOANS_COLLECTION) {
      const doc = Loans.findOne(docId);
      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else if (collection === PROPERTIES_COLLECTION) {
      const doc = Properties.findOne(docId);
      if (doc.userId !== this.userId) {
        throw new Meteor.Error('Invalid user', "You're not allowed to do this");
      }
    } else {
      throw new Meteor.Error('Invalid collection', "Collection doesn't exist");
    }

    return true;
  },
  key(file, { uploadCount, docId, id }) {
    const uploadCountPrefix = getUploadCountPrefix(uploadCount);

    return `${docId}/${id}/${uploadCountPrefix}${file.name}`;
  },
});
