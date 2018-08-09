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

export const BUCKET_NAME = 'e-potek-dev-files';

export const OBJECT_STORAGE_PATH = `https://${BUCKET_NAME}.${EXOSCALE_PATH}`;

export const OBJECT_STORAGE_REGION = 'CH-DK-2';
