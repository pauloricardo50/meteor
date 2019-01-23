export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const BODY_SIZE_LIMIT = '50mb';

export const REST_API_ERRORS = {
  WRONG_CONTENT_TYPE: contentType => ({
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    message: `Request content type must be application/json. Provided: ${contentType}`,
    errorName: 'WRONG_CONTENT_TYPE',
  }),
  WRONG_AUTHORIZATION_TYPE: {
    status: HTTP_STATUS_CODES.BAD_REQUEST,
    errorName: 'WRONG_AUTHORIZATION_TYPE',
    message: 'Authorization must be of type Bearer Token',
  },
  AUTHORIZATION_FAILED: {
    status: HTTP_STATUS_CODES.FORBIDDEN,
    errorName: 'AUTHORIZATION_FAILED',
    message: 'Wrong token',
  },
  UNKNOWN_ENDPOINT: ({ path, method }) => ({
    status: HTTP_STATUS_CODES.NOT_FOUND,
    errorName: 'UNKNOWN_ENDPOINT',
    message: `The endpoint ${method} ${path} is not valid`,
  }),
};
