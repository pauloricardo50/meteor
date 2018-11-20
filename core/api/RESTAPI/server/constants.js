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
  UNKNOWN_ENDPOINT: ({ path, method }) => ({
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'UNKNOWN_ENDPOINT',
      message: `The endpoint ${method} ${path} is not valid`,
    },
  }),
  PROMOTION_NOT_FOUND: promotionId => ({
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'PROMOTION_NOT_FOUND',
      message: `The promotion with id ${promotionId} was not found`,
    },
  }),
  NOT_ALLOWED_TO_MODIFY_PROMOTION: {
    statusCode: HTTP_STATUS_CODES.FORBIDDEN,
    body: {
      error: 'NOT_ALLOWED_TO_MODIFY_PROMOTION',
      message: 'This promotion cannot be modified with this token',
    },
  },
  MISSING_KEY: ({ key, object }) => ({
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'MISSING_KEY',
      message: `Missing key ${key} from object ${object}`,
    },
  }),
};
