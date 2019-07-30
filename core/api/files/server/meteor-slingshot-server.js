import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

import { ROLES } from 'core/api/constants';
import { COLLECTIONS } from '../../constants';
import SecurityService from '../../security';
import {
  SLINGSHOT_DIRECTIVE_NAME,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from '../fileConstants';
import uploadDirective from './uploadDirective';

export const getS3FileKey = (file, { docId, id }) =>
  `${docId}/${id}/${file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')}`;

Slingshot.createDirective(SLINGSHOT_DIRECTIVE_NAME, uploadDirective, {
  maxSize: MAX_FILE_SIZE,
  allowedFileTypes: ALLOWED_FILE_TYPES,
  authorize(file, { collection, docId }) {
    // Don't use arrow function, this is the current object here

    // Check for devs and admins
    if (
      SecurityService.hasMinimumRole({ userId: this.userId, role: ROLES.ADMIN })
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

    if (!Object.values(COLLECTIONS).includes(collection)) {
      throw new Meteor.Error('Invalid collection', "Collection doesn't exist");
    }

    SecurityService.isAllowedToModifyFiles({
      collection,
      docId,
      userId: this.userId,
      fileKey: docId,
    });

    return true;
  },
  key: getS3FileKey,
});
