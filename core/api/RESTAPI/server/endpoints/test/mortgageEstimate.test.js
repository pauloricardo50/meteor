/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';
import sinon from 'sinon';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import generator from '../../../../factories';
import { TRENDS } from '../../../../constants';
import RESTAPI from '../../RESTAPI';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';
import { mortgageEstimateAPI } from '..';

const url = '/calculator/mortgage-estimate';
const api = new RESTAPI();
api.addEndpoint(url, 'GET', mortgageEstimateAPI);

const getResult = ({ expectedResponse, query }) => {
  const { timestamp, nonce } = getTimestampAndNonce();

  return fetchAndCheckResponse({
    url,
    query,
    data: {
      method: 'GET',
      headers: makeHeaders({
        userId: 'pro',
        timestamp,
        nonce,
        query,
      }),
    },
    expectedResponse,
  });
};

describe('REST: mortgageEstimate', function () {
  this.timeout(10000);
  let now;
  let clock;

  before(function () {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    } else {
      api.start();
    }
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    generator({
      users: [{ _factory: 'pro', _id: 'pro', organisations: [{ _id: 'org' }] }],
      interestRates: [
        {
          date: moment().toDate(),
          interestLibor: {
            rateLow: 0.005,
            rateHigh: 0.01,
            trend: TRENDS.DOWN,
          },
          interest5: {
            rateLow: 0.01,
            rateHigh: 0.012,
            trend: TRENDS.UP,
          },
          interest10: {
            rateLow: 0.012,
            rateHigh: 0.015,
            trend: TRENDS.FLAT,
          },
        },
      ],
    });
    now = new Date();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it('Returns default response if only the propertyValue is given', () => {
    const expectedResponse = {
      borrowRatio: 0.8,
      date: now.getTime(),
      monthlyInterests: {
        interests10: 960,
        interests5: 800,
        interestsLibor: 400,
      },
      loanValue: 960000,
      monthlyMaintenance: 0,
      monthlyAmortization: 1000,
      notaryFees: {
        estimate: true,
        total: 60000,
      },
      ownFunds: 300000,
      monthlyTotals: {
        interests10: 1960,
        interests5: 1800,
        interestsLibor: 1400,
      },
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      totalValue: 1260000,
    };

    const query = { 'property-value': '1200000' };
    return getResult({ query, expectedResponse });
  });

  it('Uses the canton if provided', () => {
    const expectedResponse = {
      borrowRatio: 0.8,
      date: now.getTime(),
      monthlyInterests: {
        interests10: 960,
        interests5: 800,
        interestsLibor: 400,
      },
      loanValue: 960000,
      monthlyMaintenance: 0,
      monthlyAmortization: 1000,
      notaryFees: {
        canton: 'GE',
        estimate: false,
        total: 65427.96,
      },
      ownFunds: 305427.96,
      monthlyTotals: {
        interests10: 1960,
        interests5: 1800,
        interestsLibor: 1400,
      },
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      totalValue: 1265427.96,
    };

    const query = { 'property-value': '1200000', canton: 'GE' };
    return getResult({ query, expectedResponse });
  });

  it('Uses maintenance if provided', () => {
    const expectedResponse = {
      borrowRatio: 0.8,
      date: now.getTime(),
      monthlyInterests: {
        interests10: 960,
        interests5: 800,
        interestsLibor: 400,
      },
      loanValue: 960000,
      monthlyMaintenance: 1000,
      monthlyAmortization: 1000,
      notaryFees: {
        estimate: true,
        total: 60000,
      },
      ownFunds: 300000,
      monthlyTotals: {
        interests10: 2960,
        interests5: 2800,
        interestsLibor: 2400,
      },
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      totalValue: 1260000,
    };

    const query = {
      'property-value': '1200000',
      'monthly-maintenance': '1000',
    };
    return getResult({ query, expectedResponse });
  });

  it('Uses zipCode if provided', () => {
    const expectedResponse = {
      borrowRatio: 0.8,
      date: now.getTime(),
      monthlyInterests: {
        interests10: 960,
        interests5: 800,
        interestsLibor: 400,
      },
      loanValue: 960000,
      monthlyMaintenance: 0,
      monthlyAmortization: 1000,
      notaryFees: {
        canton: 'GE',
        estimate: false,
        total: 65427.96,
      },
      ownFunds: 305427.96,
      monthlyTotals: {
        interests10: 1960,
        interests5: 1800,
        interestsLibor: 1400,
      },
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      totalValue: 1265427.96,
    };

    const query = {
      'property-value': '1200000',
      'zip-code': '1201',
    };
    return getResult({ query, expectedResponse });
  });

  it('Uses includeNotaryFees if provided', () => {
    const expectedResponse = {
      borrowRatio: 0.8,
      date: now.getTime(),
      monthlyInterests: {
        interests10: 960,
        interests5: 800,
        interestsLibor: 400,
      },
      loanValue: 960000,
      monthlyMaintenance: 0,
      monthlyAmortization: 1000,
      ownFunds: 240000,
      monthlyTotals: {
        interests10: 1960,
        interests5: 1800,
        interestsLibor: 1400,
      },
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      totalValue: 1200000,
    };

    const query = {
      'property-value': '1200000',
      'include-notary-fees': 'false',
    };
    return getResult({ query, expectedResponse });
  });

  it('reduces the borrowRatio for expensive properties', () => {
    const expectedResponse = {
      borrowRatio: 0.67,
      date: now.getTime(),
      monthlyInterests: {
        interests10: 2412,
        interests5: 2010,
        interestsLibor: 1005,
      },
      loanValue: 2412000,
      monthlyMaintenance: 0,
      monthlyAmortization: 3400,
      ownFunds: 1188000,
      monthlyTotals: {
        interests10: 5812,
        interests5: 5410,
        interestsLibor: 4405,
      },
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      totalValue: 3600000,
    };

    const query = {
      'property-value': '3600000',
      'include-notary-fees': 'false',
    };
    return getResult({ query, expectedResponse });
  });
});
