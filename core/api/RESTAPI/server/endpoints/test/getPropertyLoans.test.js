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

const keyPairs = { pro: {}, pro2: {} };

const api = new RESTAPI();
api.addEndpoint('/properties/:propertyId/loans', 'GET', getPropertyLoansAPI);

const getPropertyLoans = ({ propertyId, userId }) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  return fetchAndCheckResponse({
    url: `/properties/${propertyId}/loans`,
    data: {
      method: 'GET',
      headers: makeHeaders({
        publicKey: keyPairs[userId].publicKey,
        privateKey: keyPairs[userId].privateKey,
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

describe('REST: getPropertyLoans', function () {
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
      users: [
        {
          _factory: 'pro',
          _id: 'pro',
          organisations: [{ _id: 'org' }],
          proProperties: [{ _id: 'property', category: PROPERTY_CATEGORY.PRO }],
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          organisations: [{ _id: 'org2' }],
        },
      ],
    });
    keyPairs.pro = UserService.generateKeyPair({ userId: 'pro' });
    keyPairs.pro2 = UserService.generateKeyPair({ userId: 'pro2' });
  });

  it('returns property loans', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({ propertyId: 'property', userId: 'pro' }).then((loans) => {
      expect(loans.length).to.equal(5);
      expect(loans.every(({ solvent }) => !!solvent)).to.equal(true);
    });
  });

  it('returns property anonymized loans', () => {
    PropertyService.addProUser({ propertyId: 'property', userId: 'pro2' });
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro2',
      permissions: { displayCustomersNames: false },
    });
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({ propertyId: 'property', userId: 'pro2' }).then((loans) => {
      expect(loans.length).to.equal(5);
      expect(loans.every(({ user }) => user.name === 'XXX')).to.equal(true);
      expect(loans.every(({ solvent }) => !solvent)).to.equal(true);
    });
  });

  it('returns an error if user has no access to property', () => {
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({ propertyId: 'property', userId: 'pro2' }).then((response) => {
      expect(response).to.deep.equal({
        status: 400,
        message:
            "Vous n'avez pas accès à ce bien immobilier [NOT_AUTHORIZED]",
      });
    });
  });
});
