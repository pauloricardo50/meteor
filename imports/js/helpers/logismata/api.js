import { _ } from 'lodash';
import { Meteor } from 'meteor/meteor';

let fetch;
if (Meteor.isServer) {
  fetch = require('node-fetch');
} else {
  fetch = global.fetch;
}

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
 * @param {String} testKey an optional string used for testing
 *
 * @return {String} The authentication token
 */
export const getAuthToken = testKey =>
  (token
    ? Promise.resolve(token)
    : fetch(constants.authUrl(testKey), { method: 'GET' })
      .then(handleResponse)
      .then((body) => {
        token = body.authToken;
        return body.authToken;
      }));

export const setToken = authToken =>
  Promise.resolve(authToken).then(() => {
    token = authToken;
  });

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

export const convertToLogismataTaxBase = (taxBase) => {
  const params = convertParamsToLogismata(taxBase);

  return {
    age: params.age,
    children: params.childrenCount,
    civil: params.civilStatus,
    confession: params.confession,
    gross_fortune: params.grossFortune,
    gross_income: params.grossIncome,
    income_type: params.incomeBase,
    locationid: params.locationId,
    sex: params.sex,
  };
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
    case 'calcDirectAmortization':
      return [
        '', // customization
        convertToLogismataTaxBase(params.taxBase),
        {
          amortization_goal: logismataParams.amortizationGoal,
          duration: logismataParams.duration,
          has_detailed_amortization: logismataParams.isDetailed,
          rental_value: logismataParams.rentalValue,
          maintenance_costs: logismataParams.maintenanceCosts,
          mortgages: logismataParams.mortgages,
          new_mortgages: logismataParams.newMortgages,
        },
      ];
    case 'calcIndirectAmortization':
      return [
        '', // customization
        convertToLogismataTaxBase(params.taxBase),
        {
          amortization_goal: logismataParams.amortizationGoal,
          duration: logismataParams.duration,
          saving_type: logismataParams.savingType,
          saving_interestrate: logismataParams.savingRate,
          saving_amount_manual: false,
          saving_amount: logismataParams.savingAmount,
          rental_value: logismataParams.rentalValue,
          maintenance_costs: logismataParams.maintenanceCosts,
          mortgages: logismataParams.mortgages,
          new_mortgages: logismataParams.newMortgages,
        },
      ];
    default:
      throw new Error('invalid logismata method name');
  }
};

export const getTaxBase = (data) => {};

export const callApi = (method, params) => {
  const data = JSON.stringify({
    authToken: token,
    request: {
      method,
      params: getParamsArray(method, params),
    },
  });
  console.log(JSON.parse(data, 0, 2));
  return fetch(constants.calcUrl(), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: '*/*' },
    body: data,
  }).then(response => response.json());
};

export const getLocationId = search =>
  callApi('searchLocations', {
    search,
    country: 'CH',
    language: 'all',
  }).then((result) => {
    if (result.response && result.response.length) {
      return result.response[result.response.length - 1].id;
    }
    throw new Error('Could not find locationId through logismata');
  });

export const getIndirectAmortization = () => {};

export const getDirectAmortization = () => {};
