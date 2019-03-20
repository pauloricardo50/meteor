import bodyParser from 'body-parser';
import NodeRSA from 'node-rsa';
import moment from 'moment';

import { REST_API_ERRORS, BODY_SIZE_LIMIT } from './restApiConstants';
import { Services } from '../../api-server';
import { USERS_COLLECTION } from '../../users/userConstants';
import {
  getRequestPath,
  getHeader,
  getRequestMethod,
  getErrorObject,
  getPublicKey,
} from './helpers';

import { sortObject } from '../../helpers';

const NONCE_TTL = 30;
let nonces = {
  testNonce: 1, // Used in tests
};

const bodyParserJsonMiddleware = bodyParser.json({ limit: BODY_SIZE_LIMIT });

const bodyParserUrlEncodedMiddleware = bodyParser.urlencoded({
  extended: false,
  limit: BODY_SIZE_LIMIT,
});

// Handles replay attacks
const replayHandlerMiddleware = (req, res, next) => {
  const deleteNonce = (nonce) => {
    nonces = Object.keys(nonces).reduce((newNonces, key) => {
      if (key !== nonce) {
        return { ...newNonces, [key]: nonces[key] };
      }
      return newNonces;
    }, {});
  };

  const nonceExists = (nonce) => {
    const now = moment().unix();

    // First delete all old nonces
    Object.keys(nonces).forEach((key) => {
      if (now - nonces[key] > NONCE_TTL) {
        deleteNonce(key);
      }
    });

    return nonces[nonce] !== undefined;
  };

  const addNonce = (nonce) => {
    const now = moment().unix();
    nonces[nonce] = now;
  };

  const {
    body: { timestamp, nonce },
  } = req;

  const method = getRequestMethod(req);

  // Request with GET/HEAD method cannot have a body
  if (method === 'GET' || method === 'HEAD') {
    return next();
  }

  if (!timestamp || !nonce) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }

  const now = moment().unix();

  // This is an old request
  if (timestamp < now - NONCE_TTL) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }
  if (nonceExists(nonce)) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }

  addNonce(nonce);

  next();
};

// Filters out badly formatted requests, or ones missing basic headers
const filterMiddleware = (req, res, next) => {
  const contentType = getHeader(req, 'content-type');

  if (!contentType || contentType !== 'application/json') {
    return next(REST_API_ERRORS.WRONG_CONTENT_TYPE(contentType));
  }

  next();
};

// Gets the public key from the request, fetches the user and adds it to the request
const authMiddleware = (req, res, next) => {
  // Verifies RSA body signature
  const verifySignature = (req) => {
    const {
      publicKey,
      body: { signature, ...body },
    } = req;

    const method = getRequestMethod(req);

    // Request with GET/HEAD method cannot have a body
    if (method === 'GET' || method === 'HEAD') {
      return true;
    }

    if (!signature) {
      return false;
    }

    // Import public key
    const key = new NodeRSA();
    key.importKey(publicKey, 'pkcs1-public-pem');

    // Sort body
    const sortedBody = sortObject(body);

    // Verify signature
    const verified = key.verify(
      JSON.stringify(sortedBody),
      signature,
      'utf8',
      'base64',
    );

    return verified;
  };
  const publicKey = getPublicKey(req);

  if (!publicKey) {
    return next(REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE);
  }

  const user = Services[USERS_COLLECTION].findOne({
    'apiPublicKey.publicKey': publicKey,
  });

  if (!user) {
    return next(REST_API_ERRORS.AUTHORIZATION_FAILED);
  }

  req.publicKey = publicKey;

  if (!verifySignature(req)) {
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
  replayHandlerMiddleware,
];
export const postMiddlewares = [unknownEndpointMiddleware, errorMiddleware];
