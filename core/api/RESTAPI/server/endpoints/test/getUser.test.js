/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import generator from '../../../../factories/index';
import RESTAPI from '../../RESTAPI';
import { getUserAPI } from '..';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';

const api = new RESTAPI();
api.addEndpoint('/users', 'GET', getUserAPI, {
  rsaAuth: true,
  endpointName: 'Get user',
});

const getUser = ({ email, userId, impersonateUser }) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const query = {
    email,
    ...(impersonateUser ? { 'impersonate-user': impersonateUser } : {}),
  };
  return fetchAndCheckResponse({
    url: '/users',
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

describe('REST: getUser', function() {
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
      users: [
        {
          _factory: 'pro',
          _id: 'pro',
          organisations: [
            { _id: 'org', $metadata: { isMain: true } },
            { _id: 'org2' },
          ],
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          organisations: [{ _id: 'org2' }],
          emails: [{ address: 'pro2@org2.com', verified: true }],
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          organisations: [{ _id: 'org3' }],
        },
        {
          _id: 'user1',
          firstName: 'firstName1',
          lastName: 'lastName1',
          phoneNumbers: ['+41 22 566 01 10'],
          emails: [{ address: 'user1@test.com', verified: true }],
          referredByUserLink: 'pro',
          referredByOrganisationLink: 'org',
        },
        {
          _id: 'user2',
          firstName: 'firstName2',
          lastName: 'lastName2',
          phoneNumbers: ['+41 22 566 01 10'],
          emails: [{ address: 'user2@test.com', verified: true }],
          referredByUserLink: 'pro2',
          referredByOrganisationLink: 'org',
        },
      ],
    });
  });

  it('returns user referred by org and pro', () =>
    getUser({
      email: 'user1@test.com',
      userId: 'pro',
    }).then(user => {
      expect(user.firstName).to.equal('FirstName1');
      expect(user.lastName).to.equal('LastName1');
      expect(user.emails[0].address).to.equal('user1@test.com');
      expect(user.phoneNumbers[0]).to.equal('+41 22 566 01 10');
    }));

  it('returns user referred by org with impersonate', () =>
    getUser({
      email: 'user2@test.com',
      impersonateUser: 'pro2@org2.com',
      userId: 'pro',
    }).then(user => {
      expect(user.firstName).to.equal('FirstName2');
      expect(user.lastName).to.equal('LastName2');
      expect(user.emails[0].address).to.equal('user2@test.com');
      expect(user.phoneNumbers[0]).to.equal('+41 22 566 01 10');
    }));

  it('returns user referred by org without impersonate', () =>
    getUser({
      email: 'user2@test.com',
      userId: 'pro',
    }).then(user => {
      expect(user.firstName).to.equal('FirstName2');
      expect(user.lastName).to.equal('LastName2');
      expect(user.emails[0].address).to.equal('user2@test.com');
      expect(user.phoneNumbers[0]).to.equal('+41 22 566 01 10');
    }));

  it('returns user referred by pro', () =>
    getUser({
      email: 'user2@test.com',
      userId: 'pro2',
    }).then(user => {
      expect(user.firstName).to.equal('FirstName2');
      expect(user.lastName).to.equal('LastName2');
      expect(user.emails[0].address).to.equal('user2@test.com');
      expect(user.phoneNumbers[0]).to.equal('+41 22 566 01 10');
    }));

  it('returns an error when user is not referred by org neither by user', () =>
    getUser({
      email: 'user1@test.com',
      userId: 'pro3',
    }).then(response => {
      expect(response.status).to.equal(400);
      expect(response.message).to.include('"user1@test.com"');
    }));

  it('returns an error when user does not exist', () =>
    getUser({
      email: 'user3@test.com',
      userId: 'pro',
    }).then(response => {
      expect(response.status).to.equal(400);
      expect(response.message).to.include('"user3@test.com"');
    }));
});
