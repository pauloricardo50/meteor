/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';

import generator from '../../../../factories';
import { TRENDS, INTEREST_RATES } from '../../../../constants';
import RESTAPI from '../../RESTAPI';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';
import { interestRatesAPI } from '..';

const api = new RESTAPI();
api.addEndpoint('/interest-rates/latest', 'GET', interestRatesAPI, {
  rsaAuth: true,
  endpointName: 'Get interest rates',
});

const getRates = ({ expectedResponse }) => {
  const { timestamp, nonce } = getTimestampAndNonce();

  return fetchAndCheckResponse({
    url: '/interest-rates/latest',
    data: {
      method: 'GET',
      headers: makeHeaders({
        userId: 'pro',
        timestamp,
        nonce,
      }),
    },
    expectedResponse,
  });
};

describe('REST: interestRates', function() {
  this.timeout(10000);

  before(function() {
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
    });
  });

  it('Returns empty response if no rates exist', () => {
    const expectedResponse = { rates: [], averageRates: {} };
    return getRates({ expectedResponse });
  });

  it('Returns the latest interest rates', () => {
    const momentDate = moment();
    const date = momentDate.toDate();
    const textDate = momentDate.toISOString();
    generator({
      interestRates: [
        {
          date,
          interestLibor: {
            rateLow: 0.1,
            rateHigh: 0.3,
            trend: TRENDS.DOWN,
          },
          interest5: {
            rateLow: 0.1,
            rateHigh: 0.4,
            trend: TRENDS.UP,
          },
          interest10: {
            rateLow: 0.1,
            rateHigh: 0.5,
            trend: TRENDS.FLAT,
          },
        },
      ],
    });
    const expectedResponse = {
      rates: [
        {
          rateLow: 0.1,
          rateHigh: 0.3,
          trend: TRENDS.DOWN,
          type: INTEREST_RATES.LIBOR,
        },
        {
          rateLow: 0.1,
          rateHigh: 0.4,
          trend: TRENDS.UP,
          type: INTEREST_RATES.YEARS_5,
        },
        {
          rateLow: 0.1,
          rateHigh: 0.5,
          trend: TRENDS.FLAT,
          type: INTEREST_RATES.YEARS_10,
        },
      ],
      date: textDate,
      averageRates: {
        interestLibor: 0.2,
        interest5: 0.25,
        interest10: 0.3,
      },
    };
    return getRates({ expectedResponse });
  });
});
