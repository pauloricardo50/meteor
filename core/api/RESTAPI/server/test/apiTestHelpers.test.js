import { expect } from 'chai';
import fetch from 'node-fetch';
import NodeRSA from 'node-rsa';
import queryString from 'query-string';

import { sortObject } from 'core/api/helpers/index';

const API_PORT = process.env.CIRCLE_CI ? 3000 : 4106; // API in on pro

const checkResponse = ({ res, expectedResponse, status }) =>
//   if (status) {
//     expect(res.status).to.equal(status || 200);
//   }

  res.json().then((body) => {
    expect(body).to.deep.equal(expectedResponse);
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
  status,
}) =>
  fetch(
    `http://localhost:${API_PORT}/api${url}?${queryString.stringify(query, {
      encode: true,
    })}`,
    data,
  ).then(res => checkResponse({ res, expectedResponse, status }));

const signBody = ({ body, privateKey }) => {
  const key = new NodeRSA();
  key.importKey(privateKey.replace(/\r?\n|\r/g, ''), 'pkcs1-private-pem');

  const sortedBody = sortObject(body);

  const signature = key.sign(JSON.stringify(sortedBody), 'base64', 'utf8');
  return signature;
};

const signRequest = ({ body, query, timestamp, nonce, privateKey }) => {
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
  body,
  timestamp,
  nonce,
  query,
  privateKey,
}) => ({
  'Content-Type': 'application/json',
  'X-EPOTEK-Authorization': `EPOTEK ${publicKey.replace(
    /\r?\n|\r/g,
    '',
  )}:${signRequest({
    body,
    query,
    privateKey,
    timestamp,
    nonce,
  })}`,
  'X-EPOTEK-Nonce': nonce,
  'X-EPOTEK-Timestamp': timestamp,
});
