import bodyParser from 'body-parser';

import { REST_API_ERRORS, BODY_SIZE_LIMIT } from './restApiConstants';
import { Services } from '../../api-server';
import { USERS_COLLECTION } from '../../users/userConstants';
import {
  getRequestPath,
  getToken,
  getHeader,
  getRequestMethod,
  getErrorObject,
} from './helpers';

const bodyParserJsonMiddleware = bodyParser.json({ limit: BODY_SIZE_LIMIT });

const bodyParserUrlEncodedMiddleware = bodyParser.urlencoded({
  extended: false,
  limit: BODY_SIZE_LIMIT,
});

// Filters out badly formatted requests, or ones missing basic headers
const filterMiddleware = (req, res, next) => {
  const contentType = getHeader(req, 'content-type');

  if (!contentType || contentType !== 'application/json') {
    return next(REST_API_ERRORS.WRONG_CONTENT_TYPE(contentType));
  }

  next();
};

// Gets the token from the request, fetches the user and adds it to the request
const authMiddleware = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return next(REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE);
  }

  const user = Services[USERS_COLLECTION].findOne({ apiToken: token });

  if (!user) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }

  req.user = user;

  next();
};

// Handles all errors, should be added as the very last middleware
const errorMiddleware = (error, req, res, next) => {
  const { status, errorName, message } = getErrorObject(error, res);

  res.writeHead(status);
  res.write(JSON.stringify({ status, errorName, message }));
  res.end();
};

// If no endpoint has sent a response, this should send back a 404
const unknownEndpointMiddleware = (req, res, next) => {
  next(REST_API_ERRORS.UNKNOWN_ENDPOINT({
    path: getRequestPath(req),
    method: getRequestMethod(req),
  }));
};

export const preMiddlewares = [
  filterMiddleware,
  bodyParserJsonMiddleware,
  bodyParserUrlEncodedMiddleware,
  authMiddleware,
];
export const postMiddlewares = [unknownEndpointMiddleware, errorMiddleware];
