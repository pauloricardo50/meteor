import { expect } from 'chai';
import fetch from 'node-fetch';
import NodeRSA from 'node-rsa';
import queryString from 'query-string';
import { createReadStream, statSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

import { sortObject } from 'core/api/helpers';
import UserService from 'core/api/users/server/UserService';
import { OBJECT_FORMATS, formatObject } from '../helpers';

const FormData = require('form-data');

export const API_PORT = process.env.CIRCLE_CI ? 3000 : 4105; // API in on pro

const checkResponse = ({ res, expectedResponse, include }) =>
  res.json().then(body => {
    if (expectedResponse) {
      if (include) {
        expect(body).to.deep.include(expectedResponse);
      } else {
        expect(body).to.deep.equal(expectedResponse);
      }
    }
    return Promise.resolve(body);
  });

export const getTimestampAndNonce = () => {
  const timestamp = Math.round(new Date().valueOf() / 1000).toString();
  const nonce = Math.random()
    .toString(36)
    .substr(2, 8);

  return { timestamp, nonce };
};

export const fetchAndCheckResponse = ({
  url,
  query,
  data,
  expectedResponse,
  include,
}) => {
  const urlPath = query
    ? `http://localhost:${API_PORT}/api${url}?${queryString.stringify(query, {
        encode: true,
      })}`
    : `http://localhost:${API_PORT}/api${url}`;
  return fetch(urlPath, data).then(res =>
    checkResponse({ res, expectedResponse, include }),
  );
};

const signBody = ({ body, privateKey }) => {
  const key = new NodeRSA();
  key.importKey(privateKey.replace(/\r?\n|\r/g, ''), 'pkcs1-private-pem');

  const sortedBody = sortObject(body);

  const signature = key.sign(JSON.stringify(sortedBody), 'base64', 'utf8');
  return signature;
};

export const signRequest = ({
  body,
  query,
  timestamp,
  nonce,
  privateKey,
  format,
  isMultipart,
  file,
}) => {
  if (!privateKey) {
    return '12345';
  }

  const key = new NodeRSA();
  key.importKey(privateKey.replace(/\r?\n|\r/g, ''), 'pkcs1-private-pem');

  let objectToSign = { security: sortObject({ timestamp, nonce }) };

  if (query) {
    objectToSign = { ...objectToSign, queryParams: sortObject(query) };
  }

  if (body) {
    objectToSign = { ...objectToSign, body: sortObject(body) };
  }

  if (isMultipart) {
    objectToSign = { ...objectToSign, file: sortObject(file) };
  }

  if (Object.values(OBJECT_FORMATS).includes(format)) {
    const formattedObject = formatObject(objectToSign, format);
    const signature = key.sign(
      JSON.stringify(formattedObject),
      'base64',
      'utf8',
    );
    return signature;
  }

  const signature = key.sign(JSON.stringify(objectToSign), 'base64', 'utf8');
  return signature;
};

export const makeBody = ({
  data = {},
  privateKey,
  timestampOverride,
  nonceOverride,
  signatureOverride,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();

  const filteredData = Object.keys(data)
    .filter(key => !!data[key])
    .reduce((object, key) => ({ ...object, [key]: data[key] }), {});

  const body = {
    ...filteredData,
    timestamp: timestampOverride || timestamp,
    nonce: nonceOverride || nonce,
  };
  const signature = signBody({ body, privateKey });

  return JSON.stringify({ ...body, signature: signatureOverride || signature });
};

export const makeHeaders = ({
  publicKey,
  privateKey,
  userId,
  body,
  timestamp,
  nonce,
  query,
  signature,
  isMultipart,
  file,
}) => {
  let keyPair = { publicKey, privateKey };

  if (userId) {
    keyPair = UserService.generateKeyPair({ userId });
  }

  return {
    'Content-Type': 'application/json',
    'X-EPOTEK-Authorization': `EPOTEK ${keyPair.publicKey.replace(
      /\r?\n|\r/g,
      '',
    )}:${signature ||
      signRequest({
        body,
        query,
        privateKey: keyPair.privateKey,
        timestamp,
        nonce,
        isMultipart,
        file,
      })}`,
    'X-EPOTEK-Nonce': nonce,
    'X-EPOTEK-Timestamp': timestamp,
  };
};

export const uploadFile = ({ filePath, userId, url, query, ...params }) => {
  const readStream = createReadStream(filePath);
  const form = new FormData();
  form.append('file', readStream);
  Object.keys(params).forEach(param => {
    form.append(param, params[param]);
  });

  const { timestamp, nonce } = getTimestampAndNonce();

  const options = {
    method: 'POST',
    body: form,
    headers: {
      ...makeHeaders({
        timestamp,
        nonce,
        userId,
        ...(Object.keys(params).length ? { body: params } : {}),
        isMultipart: true,
        query,
        file: {
          name: path.basename(filePath),
          size: statSync(filePath).size,
          type: mime.lookup(filePath),
        },
      }),
      ...form.getHeaders(),
    },
  };

  const urlPath = query
    ? `http://localhost:${API_PORT}/api${url}?${queryString.stringify(query, {
        encode: true,
      })}`
    : `http://localhost:${API_PORT}/api${url}`;

  return fetch(urlPath, options).then(res => res.json());
};
