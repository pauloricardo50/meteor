import { Slingshot } from 'meteor/edgee:slingshot';
import {
  SLINGSHOT_DIRECTIVE_NAME,
  SLINGSHOT_DIRECTIVE_NAME_TEMP,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from './fileConstants';

[SLINGSHOT_DIRECTIVE_NAME, SLINGSHOT_DIRECTIVE_NAME_TEMP].forEach(directive => {
  Slingshot.fileRestrictions(directive, {
    allowedFileTypes: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  });
});
