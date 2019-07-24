import { expect } from 'chai';
import fetch from 'node-fetch';
import NodeRSA from 'node-rsa';
import queryString from 'query-string';

import { sortObject } from 'core/api/helpers/index';
import UserService from 'core/api/users/server/UserService';
import { OBJECT_FORMATS, formatObject } from '../helpers';

export const API_PORT = process.env.CIRCLE_CI ? 3000 : 4106; // API in on pro

const checkResponse = ({ res, expectedResponse }) =>
  res.json().then((body) => {
    if (expectedResponse) {
      expect(body).to.deep.equal(expectedResponse);
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
}) => {
  const path = query
    ? `http://localhost:${API_PORT}/api${url}?${queryString.stringify(query, {
      encode: true,
    })}`
    : `http://localhost:${API_PORT}/api${url}`;
  return fetch(path, data).then(res =>
    checkResponse({ res, expectedResponse }));
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

  let objectToSign = {};

  if (!isMultipart) {
    objectToSign = { security: sortObject({ timestamp, nonce }) };
  }

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
  file
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
    )}:${signature
      || signRequest({
        body,
        query,
        privateKey: keyPair.privateKey,
        timestamp,
        nonce,
        isMultipart,
        file
      })}`,
    'X-EPOTEK-Nonce': nonce,
    'X-EPOTEK-Timestamp': timestamp,
  };
};
