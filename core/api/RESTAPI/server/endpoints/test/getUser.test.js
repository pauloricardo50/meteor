/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';

import { resetDatabase } from '../../../../../utils/testHelpers';
import generator from '../../../../factories/server';
import RESTAPI from '../../RESTAPI';
import {
  fetchAndCheckResponse,
  getTimestampAndNonce,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import { getUserAPI } from '..';

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
          proProperties: [{ _id: 'property' }],
          promotions: [{ _id: 'promotion' }],
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
          _factory: 'pro',
          _id: 'pro4',
          organisations: [{ _id: 'org' }],
          emails: [{ address: 'pro4@org.com', verified: true }],
          firstName: 'Pro',
          lastName: '4',
          phoneNumbers: ['+41 12345'],
        },
        {
          _id: 'user1',
          firstName: 'firstName1',
          lastName: 'lastName1',
          phoneNumbers: ['+41 22 566 01 10'],
          emails: [{ address: 'user1@test.com', verified: true }],
          referredByUserLink: 'pro',
          referredByOrganisationLink: 'org',
          assignedEmployee: {
            _id: 'admin',
            _factory: 'admin',
            emails: [{ address: 'admin@e-potek.ch', verified: true }],
          },
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
        {
          _id: 'user3',
          firstName: 'firstName3',
          lastName: 'lastName3',
          phoneNumbers: ['+41 22 566 01 10'],
          emails: [{ address: 'user3@test.com', verified: true }],
          referredByUserLink: 'pro3',
          referredByOrganisationLink: 'org3',
          loans: [{ propertyIds: ['property'] }],
        },
        {
          _id: 'user4',
          firstName: 'firstName4',
          lastName: 'lastName4',
          phoneNumbers: ['+41 22 566 01 10'],
          emails: [{ address: 'user4@test.com', verified: true }],
          referredByUserLink: 'pro3',
          referredByOrganisationLink: 'org3',
          loans: [{ promotionLinks: [{ _id: 'promotion' }] }],
        },
      ],
    });
  });

  it('returns user referred by org and pro', async () => {
    const user = await getUser({
      email: 'user1@test.com',
      userId: 'pro',
    });

    expect(user).to.deep.equal({
      _id: 'user1',
      _collection: 'users',
      email: 'user1@test.com',
      firstName: 'FirstName1',
      lastName: 'LastName1',
      name: 'FirstName1 LastName1',
      phoneNumbers: ['+41 22 566 01 10'],
      assignedRoles: ['user'],
      assignedEmployee: {
        _id: 'admin',
        _collection: 'users',
        email: 'admin@e-potek.ch',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        name: 'TestFirstName TestLastName',
        phoneNumbers: ['+41 123456789'],
      },
    });
  });

  it('returns user referred by org with impersonate', async () => {
    const user = await getUser({
      email: 'user2@test.com',
      impersonateUser: 'pro2@org2.com',
      userId: 'pro',
    });

    expect(user).to.deep.equal({
      _id: 'user2',
      _collection: 'users',
      email: 'user2@test.com',
      firstName: 'FirstName2',
      lastName: 'LastName2',
      name: 'FirstName2 LastName2',
      phoneNumbers: ['+41 22 566 01 10'],
      assignedRoles: ['user'],
    });
  });

  it('returns user referred by org without impersonate', async () => {
    const user = await getUser({
      email: 'user2@test.com',
      userId: 'pro',
    });

    expect(user).to.deep.equal({
      _id: 'user2',
      _collection: 'users',
      email: 'user2@test.com',
      firstName: 'FirstName2',
      lastName: 'LastName2',
      name: 'FirstName2 LastName2',
      phoneNumbers: ['+41 22 566 01 10'],
      assignedRoles: ['user'],
    });
  });

  it('returns user referred by pro', async () => {
    const user = await getUser({
      email: 'user2@test.com',
      userId: 'pro2',
    });

    expect(user).to.deep.equal({
      _id: 'user2',
      _collection: 'users',
      email: 'user2@test.com',
      firstName: 'FirstName2',
      lastName: 'LastName2',
      name: 'FirstName2 LastName2',
      phoneNumbers: ['+41 22 566 01 10'],
      assignedRoles: ['user'],
    });
  });

  it('returns an error when user is not referred by org neither by user', async () => {
    const response = await getUser({
      email: 'user1@test.com',
      userId: 'pro3',
    });

    expect(response.status).to.equal(404);
    expect(response.message).to.include('"user1@test.com"');
  });

  it('returns an error when user does not exist', async () => {
    const response = await getUser({
      email: 'user5@test.com',
      userId: 'pro',
    });

    expect(response.status).to.equal(404);
    expect(response.message).to.include('"user5@test.com"');
  });

  it('returns user from the same organisation', async () => {
    const user = await getUser({
      email: 'pro4@org.com',
      userId: 'pro',
    });

    expect(user).to.deep.equal({
      _id: 'pro4',
      _collection: 'users',
      email: 'pro4@org.com',
      firstName: 'Pro',
      lastName: '4',
      name: 'Pro 4',
      phoneNumbers: ['+41 12345'],
      assignedRoles: ['pro'],
    });
  });

  it('returns incomplete user when pro has access to one property of the user', async () => {
    const user = await getUser({
      email: 'user3@test.com',
      userId: 'pro',
    });

    expect(user).to.deep.equal({
      _id: 'user3',
      _collection: 'users',
      email: 'user3@test.com',
      firstName: 'FirstName3',
      lastName: 'LastName3',
      name: 'FirstName3 LastName3',
      assignedRoles: ['user'],
    });
  });

  it('returns incomplete user when pro has access to one promotion of the user', async () => {
    const user = await getUser({
      email: 'user4@test.com',
      userId: 'pro',
    });

    expect(user).to.deep.equal({
      _id: 'user4',
      _collection: 'users',
      email: 'user4@test.com',
      firstName: 'FirstName4',
      lastName: 'LastName4',
      name: 'FirstName4 LastName4',
      assignedRoles: ['user'],
    });
  });
});
