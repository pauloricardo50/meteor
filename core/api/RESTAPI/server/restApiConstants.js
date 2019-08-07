import os from 'os';

export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export const BODY_SIZE_LIMIT = '50mb';

export const REST_API_ERRORS = {
  WRONG_CONTENT_TYPE: (contentType, supportedContentType) => ({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    message: `Request content type must be ${supportedContentType}. Provided: ${contentType}`,
    errorName: 'WRONG_CONTENT_TYPE',
  }),
  WRONG_AUTHORIZATION_TYPE: {
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    errorName: 'WRONG_AUTHORIZATION_TYPE',
    message: "Authorization must be of type 'EPOTEK PublicKey:Signature'",
  },
  AUTHORIZATION_FAILED: info => ({
    status: HTTP_STATUS_CODES.FORBIDDEN,
    errorName: 'AUTHORIZATION_FAILED',
    message: 'Wrong public key or signature.',
    info,
  }),
  UNKNOWN_ENDPOINT: ({ path, method }) => ({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    errorName: 'UNKNOWN_ENDPOINT',
    message: `The endpoint ${method} ${path} is not valid`,
  }),
  REPLAY_ATTACK_ATTEMPT: {
    status: HTTP_STATUS_CODES.FORBIDDEN,
    errorName: 'REPLAY_ATTACK_ATTEMPT',
    message:
      'A replay attack has been detected. Please use a correct timestamp and a different nonce.',
  },
};

export const OS_TMP_DIR = os.tmpdir();
export const FILE_UPLOAD_DIR = `${OS_TMP_DIR}/files`;
