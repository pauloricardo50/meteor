import { DDPCommon } from 'meteor/ddp-common';
import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import NodeRSA from 'node-rsa';

import { sortObject } from '../../helpers';
import { HTTP_STATUS_CODES } from './restApiConstants';
import UserService from '../../users/server/UserService';

export const AUTH_ITEMS = {
  RSA_PUBLIC_KEY: 'RSA_PUBLIC_KEY',
  RSA_SIGNATURE: 'RSA_SIGNATURE',
};

export const getHeader = (req, name) => req.headers[name];

const getAuthItem = ({ req, item }) => {
  const authorization = getHeader(req, 'x-epotek-authorization');
  if (!authorization) {
    return undefined;
  }

  if (!authorization.includes('EPOTEK')) {
    return undefined;
  }

  switch (item) {
  case AUTH_ITEMS.RSA_PUBLIC_KEY: {
    return authorization.replace('EPOTEK ', '').split(':')[0];
  }
  case AUTH_ITEMS.RSA_SIGNATURE: {
    return authorization.replace('EPOTEK ', '').split(':')[1];
  }
  default:
    return undefined;
  }
};

export const getPublicKey = req =>
  getAuthItem({ req, item: AUTH_ITEMS.RSA_PUBLIC_KEY });

export const getSignature = req =>
  getAuthItem({ req, item: AUTH_ITEMS.RSA_SIGNATURE });

export const getRequestPath = (req) => {
  const { _parsedUrl: parsedUrl } = req;
  return parsedUrl && parsedUrl.pathname;
};

export const getRequestMethod = req => req.method;

export const withMeteorUserId = (userId, func) => {
  const invocation = new DDPCommon.MethodInvocation({
    userId,
    // isSimulation: false,
    // setUserId,
    // unblock,
    // connection: self.connectionHandle,
    // randomSeed,
  });

  return DDP._CurrentInvocation.withValue(invocation, func);
};

export const getErrorObject = (error, res) => {
  let { statusCode: status } = res;
  let message;
  let errorName;

  if (!status || status === 200) {
    status = HTTP_STATUS_CODES.SERVER_ERROR;
  }

  if (error instanceof Meteor.Error || error instanceof Match.Error) {
    message = error.message;
    status = HTTP_STATUS_CODES.BAD_REQUEST;
  } else {
    message = 'Internal server error';
  }

  if (error && error.status && error.message && error.errorName) {
    // This is one of our custom errors
    errorName = error.errorName;
    status = error.status;
    message = error.message;
  }

  return { status, errorName, message };
};

export const verifySignature = (req) => {
  const { publicKey, signature, body, query } = req;
  const timestamp = getHeader(req, 'x-epotek-timestamp');
  const nonce = getHeader(req, 'x-epotek-nonce');

  const method = getRequestMethod(req);

  // Import public key
  const key = new NodeRSA();
  key.importKey(publicKey, 'pkcs1-public-pem');

  let objectToVerify = { security: sortObject({ timestamp, nonce }) };

  if (Object.keys(query).length > 0) {
    objectToVerify = {
      ...objectToVerify,
      queryParams: sortObject(query),
    };
  }

  if (!['GET', 'HEAD'].includes(method) && Object.keys(body).length > 0) {
    objectToVerify = { ...objectToVerify, body: sortObject(body) };
  }
  // Verify signature
  const verified = key.verify(
    JSON.stringify(objectToVerify),
    signature,
    'utf8',
    'base64',
  );

  return verified;
};

export const stringToLiteral = (value) => {
  const maps = {
    NaN,
    null: null,
    undefined,
    true: true,
    false: false,
    Infinity,
    '-Infinity': -Infinity,
  };

  return Object.keys(maps).includes(value) ? maps[value] : value;
};

export const formatParams = params =>
  Object.keys(params).reduce(
    (object, key) => ({
      ...object,
      [key]: stringToLiteral(params[key]),
    }),
    {},
  );
