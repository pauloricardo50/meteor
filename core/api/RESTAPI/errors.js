export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
};

export const REST_API_ERRORS = {
  WRONG_CONTENT_TYPE: {
    statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    body: {
      error: 'WRONG_CONTENT_TYPE',
      message: 'Request content type must be application/json',
    },
  },
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
};

export const sendError = ({ res, error }) => {
  console.log('error', error);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(error.statusCode);
  res.end(JSON.stringify(error.body));
};
