import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

import SecurityService from '../../security';
import { ROLES } from '../../users/userConstants';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_TYPES_TEMP,
  MAX_FILE_SIZE,
  SLINGSHOT_DIRECTIVE_NAME,
  SLINGSHOT_DIRECTIVE_NAME_TEMP,
} from '../fileConstants';
import FileService from './FileService';
import uploadDirective from './uploadDirective';
import uploadDirectiveTemp from './uploadDirectiveTemp';

// export const getS3FileKey = (file, { docId, id }) =>
//   `${docId}/${id}/${file.name
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')}`;

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

    SecurityService.isAllowedToModifyFiles({
      collection,
      docId,
      userId: this.userId,
      fileKey: docId,
    });

    return true;
  },
  key: FileService.getS3FileKey,
});

Slingshot.createDirective(SLINGSHOT_DIRECTIVE_NAME_TEMP, uploadDirectiveTemp, {
  maxSize: MAX_FILE_SIZE,
  allowedFileTypes: ALLOWED_FILE_TYPES_TEMP,
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
  key(...args) {
    return FileService.getTempS3FileKey(this.userId, ...args);
  },
});
