import { Slingshot } from 'meteor/edgee:slingshot';
import {
  SLINGSHOT_DIRECTIVE_NAME,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from './fileConstants';

Slingshot.fileRestrictions(SLINGSHOT_DIRECTIVE_NAME, {
  allowedFileTypes: ALLOWED_FILE_TYPES,
  maxSize: MAX_FILE_SIZE,
});
