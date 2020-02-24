import bodyParser from 'body-parser';
import moment from 'moment';
import multipart from 'connect-multiparty';

import SlackService from '../../slack/server/SlackService';
import {
  REST_API_ERRORS,
  BODY_SIZE_LIMIT,
  FILE_UPLOAD_DIR,
} from './restApiConstants';
import UserService from '../../users/server/UserService';
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
  getMatchingPathOptions,
  getSimpleAuthToken,
  getRequestType,
  requestTypeIsAllowed,
  shouldSkipMiddleware,
  checkCustomAuth,
  getAnalyticsParams,
} from './helpers';
import { nonceExists, addNonce, NONCE_TTL } from './noncesHandler';

const bodyParserJsonMiddleware = () =>
  bodyParser.json({ limit: BODY_SIZE_LIMIT });

const bodyParserUrlEncodedMiddleware = () =>
  bodyParser.urlencoded({
    extended: false,
    limit: BODY_SIZE_LIMIT,
  });

const selectAuthTypeMiddleware = (options = {}) => (req, res, next) => {
  const endpointOptions = getMatchingPathOptions(req, options);
  req.authenticationType = getRequestType(req, endpointOptions);
  const { endpointName } = endpointOptions;

  // Unknown endpoint
  if (!endpointName) {
    return next();
  }

  req.endpointName = endpointName;

  if (
    requestTypeIsAllowed({
      req,
      endpointOptions,
    })
  ) {
    return next();
  }

  return next(
    REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE(
      `You tried to authenticate with ${req.authenticationType} but this endpoint does not allow it`,
    ),
  );
};

// Handles replay attacks
const replayHandlerMiddleware = (options = {}) => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'replayHandlerMiddleware' })) {
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
const filterMiddleware = (options = {}) => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'filterMiddleware' })) {
    return next();
  }

  const endpointOptions = getMatchingPathOptions(req, options);

  const supportedContentType = endpointOptions.multipart
    ? 'multipart/form-data'
    : 'application/json';
  const contentType = getHeader(req, 'content-type');

  if (!contentType || !contentType.includes(supportedContentType)) {
    return next(
      REST_API_ERRORS.WRONG_CONTENT_TYPE(
        contentType.split(';')[0],
        supportedContentType,
      ),
    );
  }

  next();
};

const simpleAuthMiddleware = (options = {}) => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'simpleAuthMiddleware' })) {
    return next();
  }

  const { query } = req;
  const simpleAuthParams = JSON.parse(
    Buffer.from(query['simple-auth-params'], 'base64').toString('ascii'),
  );
  const { token, timestamp, userId } = simpleAuthParams;
  const authToken = getSimpleAuthToken(simpleAuthParams);

  const now = moment().unix();

  if (authToken !== token || timestamp < now - 30) {
    return next(
      REST_API_ERRORS.SIMPLE_AUTHORIZATION_FAILED(
        'Wrong token or old timestamp',
      ),
    );
  }

  const user = UserService.get(userId, {
    emails: 1,
    firstName: 1,
    lastName: 1,
    phoneNumbers: 1,
  });

  if (!user) {
    return next(
      REST_API_ERRORS.SIMPLE_AUTHORIZATION_FAILED(
        'No user found with this userId',
      ),
    );
  }

  req.user = user;
  req.simpleAuthParams = simpleAuthParams;

  next();
};

// Gets the public key from the request, fetches the user and adds it to the request
const authMiddleware = (options = {}) => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'authMiddleware' })) {
    return next();
  }

  const publicKey = getPublicKey(req);
  const signature = getSignature(req);

  if (!publicKey || !signature) {
    return next(
      REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE(
        "Authorization must be of type 'EPOTEK PublicKey:Signature'",
      ),
    );
  }

  const user = UserService.get(
    {
      'apiPublicKey.publicKey': publicKey,
    },
    {
      emails: 1,
      firstName: 1,
      lastName: 1,
      phoneNumbers: 1,
    },
  );

  if (!user) {
    return next(
      REST_API_ERRORS.RSA_AUTHORIZATION_FAILED(
        'No user found with this public key, or maybe it has a typo ?',
      ),
    );
  }

  req.publicKey = publicKey;
  req.signature = signature;

  const verifiedSignature = verifySignature(req);

  if (!verifiedSignature.verified) {
    return next(
      REST_API_ERRORS.AUTHORIZATION_FAILED({
        expectedObjectToSign: verifiedSignature.toVerify,
      }),
    );
  }

  req.user = user;

  next();
};

const basicAuthMiddleware = options => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'basicAuthMiddleware' })) {
    return next();
  }

  const publicKey = getPublicKey(req);

  if (!publicKey) {
    return next(
      REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE(
        "Authorization must be of type 'EPOTEK-BASIC PublicKey'",
      ),
    );
  }

  const user = UserService.get(
    {
      'apiPublicKey.publicKey': publicKey,
    },
    {
      emails: 1,
      firstName: 1,
      lastName: 1,
      phoneNumbers: 1,
    },
  );

  if (!user) {
    return next(
      REST_API_ERRORS.BASIC_AUTHORIZATION_FAILED(
        'No user found with this public key, or maybe it has a typo ?',
      ),
    );
  }

  req.user = user;

  next();
};

// Handles all errors, should be added as the very last middleware
const errorMiddleware = options => (error, req, res, next) => {
  req.endTime = new Date().getTime();
  req.duration = req.endTime - req.startTime;
  const { info } = error;
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
  res.write(JSON.stringify({ status, errorName, message, info }));
  res.end();
};

// If no endpoint has sent a response, this should send back a 404
const unknownEndpointMiddleware = options => (req, res, next) => {
  next(
    REST_API_ERRORS.UNKNOWN_ENDPOINT({
      path: getRequestPath(req),
      method: getRequestMethod(req),
    }),
  );
};

const multipartMiddleware = options => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'multipartMiddleware' })) {
    return next();
  }
  const middleware = multipart({ uploadDir: FILE_UPLOAD_DIR });

  return middleware(req, res, next);
};

const analyticsMiddleware = options => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'analyticsMiddleware' })) {
    return next();
  }

  const analyticsParams = getAnalyticsParams({ req, options });
  req.analyticsParams = analyticsParams;

  next();
};

const customAuthMiddleware = options => (req, res, next) => {
  if (shouldSkipMiddleware({ req, middleware: 'customAuthMiddleware' })) {
    return next();
  }

  const endpointOptions = getMatchingPathOptions(req, options);

  const { customAuth } = endpointOptions;

  try {
    checkCustomAuth({ customAuth, req });
  } catch (error) {
    return next(REST_API_ERRORS.AUTHENTICATION_FAILED(error));
  }

  next();
};

export const preMiddlewares = [
  selectAuthTypeMiddleware,
  filterMiddleware,
  multipartMiddleware,
  bodyParserJsonMiddleware,
  bodyParserUrlEncodedMiddleware,
  authMiddleware,
  simpleAuthMiddleware,
  basicAuthMiddleware,
  customAuthMiddleware,
  replayHandlerMiddleware,
  analyticsMiddleware,
];
export const postMiddlewares = [unknownEndpointMiddleware, errorMiddleware];
