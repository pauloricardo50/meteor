import bodyParser from 'body-parser';
import moment from 'moment';
import multipart from 'connect-multiparty';
import os from 'os';

import SlackService from '../../slack/server/SlackService';
import {
  REST_API_ERRORS,
  BODY_SIZE_LIMIT,
  FILE_UPLOAD_DIR,
} from './restApiConstants';
import { Services } from '../../server';
import { USERS_COLLECTION } from '../../users/userConstants';
import {
  getRequestPath,
  getHeader,
  getRequestMethod,
  getErrorObject,
  getPublicKey,
  verifySignature,
  getSignature,
  logRequest,
  trackRequest,
} from './helpers';
import { nonceExists, addNonce, NONCE_TTL } from './noncesHandler';

const bodyParserJsonMiddleware = bodyParser.json({ limit: BODY_SIZE_LIMIT });

const bodyParserUrlEncodedMiddleware = bodyParser.urlencoded({
  extended: false,
  limit: BODY_SIZE_LIMIT,
});

// Handles replay attacks
const replayHandlerMiddleware = (req, res, next) => {
  if (req.isMultipart) {
    return next();
  }
  const timestamp = getHeader(req, 'x-epotek-timestamp');
  const nonce = getHeader(req, 'x-epotek-nonce');

  if (!timestamp || !nonce) {
    return next(REST_API_ERRORS.REPLAY_ATTACK_ATTEMPT);
  }

  const now = moment().unix();

  // This is an old request
  if (timestamp < now - NONCE_TTL) {
    return next(REST_API_ERRORS.REPLAY_ATTACK_ATTEMPT);
  }
  if (nonceExists(nonce)) {
    return next(REST_API_ERRORS.REPLAY_ATTACK_ATTEMPT);
  }

  addNonce(nonce);

  next();
};

// Filters out badly formatted requests, or ones missing basic headers
const filterMiddleware = (req, res, next) => {
  const contentType = getHeader(req, 'content-type');
  const isMultipart = contentType.includes('multipart/form-data');

  if (!contentType || (contentType !== 'application/json' && !isMultipart)) {
    return next(REST_API_ERRORS.WRONG_CONTENT_TYPE(contentType));
  }

  if (isMultipart) {
    req.isMultipart = true;
  }

  next();
};

// Gets the public key from the request, fetches the user and adds it to the request
const authMiddleware = (req, res, next) => {
  const publicKey = getPublicKey(req);
  const signature = getSignature(req);

  if (!publicKey || !signature) {
    return next(REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE);
  }

  const user = Services[USERS_COLLECTION].findOne({
    'apiPublicKey.publicKey': publicKey,
  });

  if (!user) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }

  req.publicKey = publicKey;
  req.signature = signature;

  if (!verifySignature(req)) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }

  req.user = user;

  next();
};

// Handles all errors, should be added as the very last middleware
const errorMiddleware = (error, req, res, next) => {
  const { status, errorName, message } = getErrorObject(error, res);
  const { user = {}, body = {}, params = {}, query = {}, headers = {} } = req;

  SlackService.sendError({
    error,
    additionalData: [
      Object.keys(body).length > 0 && { body },
      Object.keys(params).length > 0 && { params },
      Object.keys(query).length > 0 && { query },
      Object.keys(headers).length > 0 && { headers },
    ].filter(x => x),
    userId: user._id,
    url: getRequestPath(req),
  });

  logRequest({ req, result: JSON.stringify({ status, errorName, message }) });
  if (Object.keys(user) > 0) {
    trackRequest({
      req,
      result: JSON.stringify({ status, errorName, message }),
    });
  }

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

const multipartMiddleware = (req, res, next) => {
  const middleware = multipart({ uploadDir: FILE_UPLOAD_DIR });
  const { isMultipart } = req;

  return isMultipart ? middleware(req, res, next) : next();
};

export const preMiddlewares = [
  filterMiddleware,
  multipartMiddleware,
  bodyParserJsonMiddleware,
  bodyParserUrlEncodedMiddleware,
  authMiddleware,
  replayHandlerMiddleware,
];
export const postMiddlewares = [unknownEndpointMiddleware, errorMiddleware];
