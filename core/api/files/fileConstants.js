import { Meteor } from 'meteor/meteor';

export const FILE_STATUS = {
  UNVERIFIED: 'UNVERIFIED',
  VALID: 'VALID',
  ERROR: 'ERROR',
};

export const FILE_STEPS = {
  AUCTION: 'auction',
  CONTRACT: 'contract',
  CLOSING: 'closing',
  ALL: 'all',
};

export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
];

// 50 MB (use null for unlimited)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const SLINGSHOT_DIRECTIVE_NAME = 'exoscale';

export const EXOSCALE_PATH = 'sos-ch-dk-2.exo.io';

let BUCKET_NAME = '';

if (Meteor.isServer) {
  BUCKET_NAME = Meteor.settings.storage.bucketName;
}

export { BUCKET_NAME };

export const TEST_BUCKET_NAME = 'e-potek-test-bucket';

export const OBJECT_STORAGE_PATH = `https://${BUCKET_NAME}.${EXOSCALE_PATH}`;

export const OBJECT_STORAGE_REGION = 'CH-DK-2';

export const S3_ENDPOINT = 'https://sos-ch-dk-2.exo.io';
