/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import UserService from '../../../../users/server/UserService';
import generator from '../../../../factories/index';
import RESTAPI from '../../RESTAPI';
import referCustomerAPI from '../referCustomer';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';

let keyPair;
const customerToRefer = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1234',
};

const api = new RESTAPI();
api.addEndpoint('/users', 'POST', referCustomerAPI);

const referCustomer = ({ userData, referredBy, expectedResponse }) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = { user: userData || customerToRefer, referredBy };
  return fetchAndCheckResponse({
    url: '/users',
    data: {
      method: 'POST',
      headers: makeHeaders({
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        timestamp,
        nonce,
        body,
      }),
      body: JSON.stringify(body),
    },
    expectedResponse,
  });
};

describe('REST: referCustomer', function () {
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
        { _factory: 'pro', _id: 'pro', organisations: [{ _id: 'org' }] },
        {
          _factory: 'pro',
          _id: 'pro2',
          emails: [{ address: 'pro2@org.com', verified: true }],
          organisations: [{ _id: 'org' }],
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          emails: [{ address: 'pro3@org2.com', verified: true }],
          organisations: [{ _id: 'org2' }],
        },
      ],
    });
    keyPair = UserService.generateKeyPair({ userId: 'pro' });
  });

  it('refers a customer', () =>
    referCustomer({
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    }).then(() => {
      const customer = UserService.findOne({
        'emails.address': { $in: [customerToRefer.email] },
      });
      expect(customer.referredByUserLink).to.equal('pro');
      expect(customer.referredByOrganisationLink).to.equal('org');
    }));

  it('refers a customer with referredBy', () =>
    referCustomer({
      referredBy: 'pro2@org.com',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    }).then(() => {
      const customer = UserService.findOne({
        'emails.address': { $in: [customerToRefer.email] },
      });
      expect(customer.referredByUserLink).to.equal('pro2');
      expect(customer.referredByOrganisationLink).to.equal('org');
    }));

  it('returns an error when referredBy is not in the same organisation', () =>
    referCustomer({
      referredBy: 'pro3@org2.com',
      expectedResponse: {
        status: 400,
        message:
          '[User with email address "pro3@org2.com" is not part of your organisation]',
      },
    }));

  it('returns an error if the user already exists', () => {
    generator({
      users: { emails: [{ address: customerToRefer.email, verified: false }] },
    });
    return referCustomer({
      expectedResponse: {
        status: 400,
        message:
          "[Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.]",
      },
    });
  });
});
