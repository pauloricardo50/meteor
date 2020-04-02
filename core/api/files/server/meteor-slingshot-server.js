import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

import { ROLES } from '../../users/userConstants';
import SecurityService from '../../security';
import {
  SLINGSHOT_DIRECTIVE_NAME,
  SLINGSHOT_DIRECTIVE_NAME_TEMP,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_TYPES_TEMP,
} from '../fileConstants';
import uploadDirective from './uploadDirective';
import uploadDirectiveTemp from './uploadDirectiveTemp';
import FileService from './FileService';

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
