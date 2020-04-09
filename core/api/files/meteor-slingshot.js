import { Slingshot } from 'meteor/edgee:slingshot';

import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  SLINGSHOT_DIRECTIVE_NAME,
  SLINGSHOT_DIRECTIVE_NAME_TEMP,
} from './fileConstants';

[SLINGSHOT_DIRECTIVE_NAME, SLINGSHOT_DIRECTIVE_NAME_TEMP].forEach(directive => {
  Slingshot.fileRestrictions(directive, {
    allowedFileTypes: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  });
});
