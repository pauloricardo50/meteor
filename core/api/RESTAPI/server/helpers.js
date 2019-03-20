import { DDPCommon } from 'meteor/ddp-common';
import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import NodeRSA from 'node-rsa';

import { sortObject } from '../../helpers';
import { HTTP_STATUS_CODES } from './restApiConstants';

export const getHeader = (req, name) => req.headers[name];

export const getPublicKey = (req) => {
  const authorization = getHeader(req, 'authorization');
  if (!authorization) {
    return undefined;
  }

  if (!authorization.includes('Bearer')) {
    return undefined;
  }

  const publicKey = authorization.replace('Bearer ', '');

  return publicKey;
};

export const getRequestPath = (req) => {
  const { _parsedUrl: parsedUrl } = req;
  return parsedUrl && parsedUrl.path;
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
