export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
};

export const REST_API_ERRORS = {
  WRONG_CONTENT_TYPE: contentType => ({
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'WRONG_CONTENT_TYPE',
      message: `Request content type must be application/json. Provided: ${contentType}`,
    },
  }),
  WRONG_AUTHORIZATION_TYPE: {
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'WRONG_AUTHORIZATION_TYPE',
      message: 'Authorization must be of type Bearer Token',
    },
  },
  AUTHORIZATION_FAILED: {
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    body: {
      error: 'AUTHORIZATION_FAILED',
      message: 'Wrong token',
    },
  },
  UNKNOWN_ENDPOINT: endpoint => ({
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'UNKNOWN_ENDPOINT',
      message: `The endpoint ${endpoint} is not valid`,
    },
  }),
};
