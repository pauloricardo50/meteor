/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';

import { resetDatabase } from '../../../../../utils/testHelpers';
import generator from '../../../../factories/server';
import {
  PROPERTY_CATEGORY,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../../../../properties/propertyConstants';
import PropertyService from '../../../../properties/server/PropertyService';
import RESTAPI from '../../RESTAPI';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import {
  fetchAndCheckResponse,
  getTimestampAndNonce,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import getPropertyLoansAPI from '../getPropertyLoans';

const api = new RESTAPI();
api.addEndpoint('/properties/:propertyId/loans', 'GET', getPropertyLoansAPI, {
  rsaAuth: true,
  endpointName: 'Get property loans',
});

const getPropertyLoans = ({ propertyId, userId, impersonateUser }) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const query = impersonateUser && { 'impersonate-user': impersonateUser };
  return fetchAndCheckResponse({
    url: `/properties/${propertyId}/loans`,
    query,
    data: {
      method: 'GET',
      headers: makeHeaders({
        userId,
        timestamp,
        nonce,
        query,
      }),
    },
  });
};

const makeCustomers = count =>
  [...Array(count)].map((_, index) => ({
    _id: `user${index}`,
    referredByUserLink: 'pro',
    referredByOrganisationLink: 'org',
    loans: [
      {
        _id: `loan${index}`,
        propertyIds: ['property'],
        adminNotes: [
          {
            id: '1',
            isSharedWithPros: false,
            note: 'Test1',
            updatedBy: 'admin',
          },
          {
            id: '2',
            isSharedWithPros: true,
            note: 'Test2',
            updatedBy: 'admin',
          },
        ],
      },
    ],
  }));

describe('REST: getPropertyLoans', function() {
  this.timeout(10000);

  before(function() {
    api.start();
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
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          organisations: [{ _id: 'org' }],
          emails: [{ address: 'pro2@org.com', verified: true }],
          proProperties: [
            {
              _id: 'property',
              externalId: 'extId',
              category: PROPERTY_CATEGORY.PRO,
            },
          ],
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          organisations: [{ _id: 'org2' }],
        },
      ],
    });
  });

  it('returns property loans', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro2',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    generator({ users: makeCustomers(5) });

    return getPropertyLoans({
      propertyId: 'property',
      userId: 'pro',
      impersonateUser: 'pro2@org.com',
    }).then(loans => {
      expect(loans.length).to.equal(5);
      expect(loans.every(({ solvent }) => !!solvent)).to.equal(true);
      expect(loans.every(({ proNotes = [] }) => proNotes.length === 1));
    });
  });

  it('returns property anonymized loans', () => {
    PropertyService.addProUser({ propertyId: 'property', userId: 'pro3' });
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro3',
      permissions: { displayCustomersNames: false },
    });
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({ propertyId: 'property', userId: 'pro3' }).then(
      loans => {
        expect(loans.length).to.equal(5);
        expect(loans.every(({ user }) => user.name === 'XXX')).to.equal(true);
        expect(loans.every(({ solvent }) => !solvent)).to.equal(true);
      },
    );
  });

  it('returns an error if user has no access to property', () => {
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({ propertyId: 'property', userId: 'pro3' }).then(
      response => {
        expect(response).to.deep.equal({
          status: 400,
          message:
            "Vous n'avez pas accès à ce bien immobilier [NOT_AUTHORIZED]",
        });
      },
    );
  });

  it('returns property loans', () => {
    PropertyService.setProUserPermissions({
      propertyId: 'property',
      userId: 'pro2',
      permissions: PROPERTY_PERMISSIONS_FULL_ACCESS,
    });
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({
      propertyId: 'extId',
      userId: 'pro',
      impersonateUser: 'pro2@org.com',
    }).then(loans => {
      expect(loans.length).to.equal(5);
      expect(loans.every(({ solvent }) => !!solvent)).to.equal(true);
    });
  });

  it('fails when property does not exist', () => {
    generator({ users: makeCustomers(5) });
    return getPropertyLoans({
      propertyId: '12345',
      userId: 'pro',
      impersonateUser: 'pro2@org.com',
    }).then(response => {
      expect(response.status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
      expect(response.message).to.include('not found');
    });
  });
});
