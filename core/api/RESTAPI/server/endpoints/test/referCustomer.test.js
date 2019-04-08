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

const referCustomer = ({ userData, expectedResponse }) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = { user: userData || customerToRefer };
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

describe.only('REST: referCustomer', function () {
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
      users: { _factory: 'pro', _id: 'pro', organisations: [{ _id: 'org' }] },
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
