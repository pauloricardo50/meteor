/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import UserService from '../../../../users/server/UserService';
import PropertyService from '../../../../properties/server/PropertyService';
import generator from '../../../../factories/index';
import RESTAPI from '../../RESTAPI';
import getPropertyLoansAPI from '../getPropertyLoans';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';
import {
  PROPERTY_CATEGORY,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../../../../constants';

let keyPair;

const api = new RESTAPI();
api.addEndpoint('/properties/:propertyId/loans', 'GET', getPropertyLoansAPI);

const getPropertyLoans = (propertyId) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  return fetchAndCheckResponse({
    url: `/properties/${propertyId}/loans`,
    data: {
      method: 'GET',
      headers: makeHeaders({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        timestamp,
        nonce,
      }),
    },
  });
};

const makeCustomers = count =>
  [...Array(count)].map((_, index) => ({
    _id: `user${index}`,
    referredByUserLink: 'pro',
    referredByOrganisationLink: 'org',
    loans: [{ _id: `loan${index}`, propertyIds: ['property'] }],
  }));

describe.only('REST: getPropertyLoans', function () {
  this.timeout(10000);

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
      users: {
        _factory: 'pro',
        _id: 'pro',
        organisations: [{ _id: 'org' }],
        proProperties: [{ _id: 'property', category: PROPERTY_CATEGORY.PRO }],
      },
    });
    keyPair = UserService.generateKeyPair({ userId: 'pro' });
  });

  it('returns property loans', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    generator({
      users: makeCustomers(5),
    });
    return getPropertyLoans('property').then((loans) => {
      expect(loans.length).to.equal(5);
    });
  });
});
