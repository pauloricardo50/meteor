import { Slingshot } from 'meteor/edgee:slingshot';

import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_TYPES_DISPLAYABLE,
  MAX_DISPLAYABLE_FILE_SIZE,
  MAX_FILE_SIZE,
  SLINGSHOT_DIRECTIVE_NAME,
  SLINGSHOT_DIRECTIVE_NAME_DISPLAYABLE,
  SLINGSHOT_DIRECTIVE_NAME_TEMP,
} from './fileConstants';

[SLINGSHOT_DIRECTIVE_NAME, SLINGSHOT_DIRECTIVE_NAME_TEMP].forEach(directive => {
  Slingshot.fileRestrictions(directive, {
    allowedFileTypes: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  });
});

Slingshot.fileRestrictions(SLINGSHOT_DIRECTIVE_NAME_DISPLAYABLE, {
  allowedFileTypes: ALLOWED_FILE_TYPES_DISPLAYABLE,
  maxSize: MAX_DISPLAYABLE_FILE_SIZE,
});
