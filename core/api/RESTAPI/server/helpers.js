import { DDPCommon } from 'meteor/ddp-common';
import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';

import { Match } from 'meteor/check';
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
