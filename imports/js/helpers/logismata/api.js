import { _ } from 'lodash';
import fetch from 'node-fetch';

import constants, { logismataValues } from './constants';

// Where the current token will be stored
let token;

export const handleResponse = (response) => {
  if (response.status !== 200) {
    throw response;
  }

  return response.json();
};

/**
 * getAuthToken - verifies if the token exists, and fetches a new one if not
 *
 * @param {String} key an optional string used for testing
 *
 * @return {String} The authentication token
 */
export const getAuthToken = key =>
  (token
    ? Promise.resolve(token)
    : fetch(constants.authUrl(key), { method: 'GET' })
      .then(handleResponse)
      .then((body) => {
        token = body.authToken;
        return body.authToken;
      }));

export const convertParamsToLogismata = (params = {}) => {
  const newParams = { ...params };

  Object.keys(logismataValues).forEach((key) => {
    if (params[key] !== undefined) {
      const newValue = _.findKey(
        logismataValues[key],
        val => val === params[key],
      );

      if (!newValue) {
        throw new Error('invalid logismata value provided');
      }

      newParams[key] = Number(newValue);
    } else {
      newParams[key] = logismataValues[key].default;
    }
  });

  return newParams;
};

/**
 * getParamsArray - Returns an array of parameters in the right order
 * for logismata's API
 *
 * @param {String} method the name of the logismata method
 * @param {Object} params an object of values
 *
 * @return {Array}
 */

export const getParamsArray = (method, params) => {
  const logismataParams = convertParamsToLogismata(params);
  switch (method) {
    case 'getLocationInfo':
      return [logismataParams.locationId];
    case 'searchLocations':
      return [
        logismataParams.search,
        logismataParams.language,
        logismataParams.country,
      ];
    case 'calcTaxableIncomeState':
    // Same as calcTaxableIncomeCountry
    case 'calcTaxableIncomeCountry':
      return [
        logismataParams.locationId,
        logismataParams.age,
        logismataParams.civilStatus,
        logismataParams.confession,
        logismataParams.childrenCount,
        logismataParams.grossIncome,
        logismataParams.isEmployee,
      ];
    case 'calcTaxableFortune':
      return [
        logismataParams.locationId,
        logismataParams.age,
        logismataParams.civilStatus,
        logismataParams.childrenCount,
        logismataParams.grossFortune,
      ];
    case 'calcIndirectAmortization':
      return [];
    case 'calcDirectAmortization':
      return [];
    default:
      throw new Error('invalid logismata method name');
  }
};

export const getTaxBase = (data) => {};

export const callApi = (method, params) =>
  getAuthToken()
    .then((_token) => {
      const data = JSON.stringify({
        authToken: _token,
        request: {
          method,
          params: getParamsArray(method, params),
        },
      });
      return fetch(constants.calcUrl(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
        body: data,
      });
    })
    .then(response => response.json());

export const getLocationId = search =>
  callApi('searchLocations', {
    search,
    country: 'CH',
    language: 'all',
  }).then(
    result =>
      !!(result.response && result.response.length) &&
      result.response[result.response.length - 1].id,
  );

export const getIndirectAmortization = () => {};

export const getDirectAmortization = () => {};
