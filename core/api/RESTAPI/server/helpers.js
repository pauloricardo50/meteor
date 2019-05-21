import { DDPCommon } from 'meteor/ddp-common';
import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import NodeRSA from 'node-rsa';
import get from 'lodash/get';
import set from 'lodash/set';

import Analytics from 'core/api/analytics/server/Analytics';
import { Random } from 'meteor/random';
import EVENTS from 'core/api/analytics/events';
import UserService from 'core/api/users/server/UserService';
import { sortObject } from '../../helpers';
import { HTTP_STATUS_CODES } from './restApiConstants';
import { getImpersonateUserId } from './endpoints/helpers';

export const AUTH_ITEMS = {
  RSA_PUBLIC_KEY: 'RSA_PUBLIC_KEY',
  RSA_SIGNATURE: 'RSA_SIGNATURE',
};

export const OBJECT_FORMATS = {
  DEFAULT: 'DEFAULT',
  TO_LITERRAL: 'TO_LITERRAL',
  TO_STRING: 'TO_STRING',
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

export const updateCustomerReferral = ({
  customer,
  userId,
  impersonateUser,
}) => {
  if (impersonateUser) {
    const customerId = UserService.getByEmail(customer.email)._id;
    return UserService.setReferredByOrganisation({
      userId: customerId,
      organisationId: UserService.getUserMainOrganisationId(userId),
    });
  }
  return Promise.resolve();
};

export const withMeteorUserId = ({ userId, impersonateUser }, func) => {
  let impersonateUserId;
  if (impersonateUser) {
    impersonateUserId = getImpersonateUserId({ userId, impersonateUser });
  }

  const invocation = new DDPCommon.MethodInvocation({
    userId: impersonateUserId || userId,
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

export const stringToLiteral = (value) => {
  const maps = {
    true: true,
    false: false,
    undefined,
    NaN,
    Infinity,
    '-Infinity': -Infinity,
    null: null,
  };
  if (value && !isNaN(value)) {
    return parseInt(value);
  }

  return Object.keys(maps).includes(value) ? maps[value] : value;
};

export const literalToString = (value) => {
  switch (value) {
  case true:
    return 'true';
  case false:
    return 'false';
  case undefined:
    return 'undefined';
  case null:
    return 'null';
  case NaN:
    return 'NaN';
  case Infinity:
    return 'Infinity';
  case -Infinity:
    return '-Infinity';
  default:
    return value.toString();
  }
};

// Return array of every object's properties
const getObjectPropertiesPath = (obj, stack, res) => {
  let arr = res;
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (obj[property] && typeof obj[property] === 'object') {
        if (
          (Array.isArray(obj[property]) && obj[property].length === 0)
          || Object.keys(obj[property]).length === 0
        ) {
          const str = `${stack}.${property}`.substr(1);
          arr = [...arr, str];
        } else {
          arr = getObjectPropertiesPath(
            obj[property],
            `${stack}.${property}`,
            arr,
          );
        }
      } else {
        const str = `${stack}.${property}`.substr(1);
        arr = [...arr, str];
      }
    }
  }

  return arr;
};

export const formatObject = (obj, format) => {
  if (format === OBJECT_FORMATS.DEFAULT) {
    return obj;
  }

  const properties = getObjectPropertiesPath(obj, '', []);
  const formattedObject = {};

  properties.forEach((property) => {
    const value = get(obj, property);
    switch (format) {
    // String to literal
    case OBJECT_FORMATS.TO_LITERRAL: {
      set(formattedObject, property, stringToLiteral(value));
      break;
    }
    // Literal to string
    case OBJECT_FORMATS.TO_STRING: {
      set(formattedObject, property, literalToString(value));
      break;
    }
    default:
      break;
    }
  });

  return formattedObject;
};

export const formatParams = params =>
  Object.keys(params).reduce(
    (object, key) => ({
      ...object,
      [key]: stringToLiteral(params[key]),
    }),
    {},
  );

export const logRequest = ({ req, result }) => {
  const {
    user: { _id, emails } = {},
    body = {},
    params = {},
    query = {},
    headers = {},
    verifiedFormat,
  } = req;

  if (Meteor.isTest) {
    return;
  }

  console.log('----- API CALL -----');
  console.log('USER:', JSON.stringify({ _id, emails }, null, 2));
  console.log('URL:', getRequestPath(req));
  console.log('HEADERS:', JSON.stringify(headers, null, 2));
  console.log('BODY:', JSON.stringify(body, null, 2));
  console.log('PARAMS:', JSON.stringify(params, null, 2));
  console.log('QUERY:', JSON.stringify(query, null, 2));
  console.log('VERIFIED FORMAT:', verifiedFormat);
  console.log('RESULT:', result);
  console.log('-----------------');
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

  const verified = Object.keys(OBJECT_FORMATS).some((format) => {
    const isValid = key.verify(
      JSON.stringify(formatObject(objectToVerify, format)),
      signature,
      'utf8',
      'base64',
    );

    if (isValid) {
      req.verifiedFormat = format;
    }
    return isValid;
  });

  return verified;
};

export const trackRequest = ({ req, result }) => {
  const { user: { _id: userId } = {}, headers = {} } = req;
  const { 'x-forwarded-for': clientAddress, host, 'x-real-ip': realIp } = headers;

  const analytics = new Analytics({
    userId,
    connection: { clientAddress, httpHeaders: { host, 'x-real-ip': realIp } },
  });

  if (userId) {
    analytics.identify(Random.id(16));
  }

  analytics.track(EVENTS.API_CALLED, { endpoint: getRequestPath(req), result });
};
