import { createQuery } from 'meteor/cultofcoders:grapher';

import { GOOGLE_DRIVE_QUERIES } from './googleDriveConstants';

export const loanGoogleDriveFiles = createQuery(
  GOOGLE_DRIVE_QUERIES.LOAN_GOOGLE_DRIVE_FILES,
  () => {},
);
