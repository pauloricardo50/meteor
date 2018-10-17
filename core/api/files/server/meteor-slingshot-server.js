import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';

import { Loans, Properties, Borrowers, Promotions } from '../..';
import {
  LOANS_COLLECTION,
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
} from '../../constants';
import SecurityService from '../../security';
import {
  SLINGSHOT_DIRECTIVE_NAME,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from '../fileConstants';
import uploadDirective from './uploadDirective';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';

Slingshot.createDirective(SLINGSHOT_DIRECTIVE_NAME, uploadDirective, {
  maxSize: MAX_FILE_SIZE,
  allowedFileTypes: ALLOWED_FILE_TYPES,
  authorize(file, { collection, docId }) {
    // Don't use arrow function, this is the current object here

    // Check for devs and admins
    if (
      Roles.userIsInRole(this.userId, 'admin')
      || Roles.userIsInRole(this.userId, 'dev')
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
      SecurityService.borrowers.isAllowedToUpdate(doc);
    } else if (collection === LOANS_COLLECTION) {
      const doc = Loans.findOne(docId);
      SecurityService.loans.isAllowedToUpdate(doc);
    } else if (collection === PROPERTIES_COLLECTION) {
      const doc = Properties.findOne(docId);
      SecurityService.properties.isAllowedToUpdate(doc);
    } else if (collection === PROMOTIONS_COLLECTION) {
      const doc = Promotions.findOne(docId);
      SecurityService.promotions.isAllowedToUpdate(doc);
    } else {
      throw new Meteor.Error('Invalid collection', "Collection doesn't exist");
    }

    return true;
  },
  key: (file, { docId, id }) => `${docId}/${id}/${file.name}`,
});
