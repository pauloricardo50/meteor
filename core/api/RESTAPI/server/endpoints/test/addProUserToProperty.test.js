import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import generator from '../../../../factories';
import { PROPERTY_CATEGORY } from '../../../../properties/propertyConstants';
import {
  getTimestampAndNonce,
  fetchAndCheckResponse,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';

import addProUserToPropertyAPI from '../addProUserToProperty';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import PropertyService from '../../../../properties/server/PropertyService';

const api = new RESTAPI();
api.addEndpoint(
  '/properties/:propertyId/add-user',
  'POST',
  addProUserToPropertyAPI,
);

const addUser = ({
  propertyId,
  body,
  expectedResponse,
  status,
  userId,
  impersonateUser,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const query = impersonateUser
    ? { 'impersonate-user': impersonateUser }
    : undefined;
  return fetchAndCheckResponse({
    url: `/properties/${propertyId}/add-user`,
    query,
    data: {
      method: 'POST',
      headers: makeHeaders({ userId, timestamp, nonce, body, query }),
      body: JSON.stringify(body),
    },
    expectedResponse,
    status,
  });
};

describe('REST: addProUserToProperty', function () {
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
          _id: 'pro',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro@org.com', verified: true }],
          isDisabled: false,
          proProperties: {
            _id: 'prop',
            externalId: 'extId',
            category: PROPERTY_CATEGORY.PRO,
            $metadata: {
              permissions: {
                canModifyProperty: true,
                canManagePermissions: true,
                canInviteProUsers: true,
              },
            },
          },
        },
        {
          _id: 'pro2',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro2@org.com', verified: true }],
          isDisabled: false,
          proProperties: {
            _id: 'prop',
            externalId: 'extId',
            category: PROPERTY_CATEGORY.PRO,
            $metadata: {
              permissions: {
                canModifyProperty: true,
                canManagePermissions: true,
                canInviteProUsers: true,
              },
            },
          },
        },
        {
          _id: 'pro3',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          isDisabled: false,
          emails: [{ address: 'pro3@org.com', verified: true }],
        },
        {
          _id: 'pro4',
          _factory: 'pro',
          organisations: { _id: 'org2' },
          isDisabled: false,
          emails: [{ address: 'pro4@org2.com', verified: true }],
        },
      ],
    });
  });

  it('add user to property', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then((response) => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal('User with email "pro3@org.com" sucessfully added on property with id "prop" !');
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('add user from another organisation', () => {
    const body = {
      email: 'pro4@org2.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then((response) => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal('User with email "pro4@org2.com" sucessfully added on property with id "prop" !');
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('add user to property with extId', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'extId',
      body,
    }).then((response) => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal('User with email "pro3@org.com" sucessfully added on property with id "extId" !');
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('add user to property using impersonation', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'prop',
      body,
      impersonateUser: 'pro2@org.com',
    }).then((response) => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal('User with email "pro3@org.com" sucessfully added on property with id "prop" !');
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('throws if user cannot add pro users', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    PropertyService.setProUserPermissions({
      propertyId: 'prop',
      userId: 'pro2',
      permissions: { canInviteProUsers: false },
    });
    return addUser({
      userId: 'pro2',
      propertyId: 'extId',
      body,
    }).then((response) => {
      const { message } = response;
      expect(message).to.contain('Vous ne pouvez pas inviter');
    });
  });

  it('throws if user cannot manage permissions', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    PropertyService.setProUserPermissions({
      propertyId: 'prop',
      userId: 'pro2',
      permissions: { canManagePermissions: false, canInviteProUsers: true },
    });
    return addUser({
      userId: 'pro2',
      propertyId: 'extId',
      body,
    }).then((response) => {
      const { message } = response;
      expect(message).to.contain('Vous ne pouvez pas gérer');
    });
  });

  it('throws if user does not exist', () => {
    const body = {
      email: 'wrong@email.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then((response) => {
      const { message } = response;
      expect(message).to.contain('No user found');
    });
  });

  it('throws if property does not exist', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'wrongId',
      body,
    }).then((response) => {
      const { message } = response;
      expect(message).to.contain('No property found');
    });
  });

  it('throws if user is already on property', () => {
    const body = {
      email: 'pro2@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return addUser({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then((response) => {
      const { message } = response;
      expect(message).to.contain('User with email "pro2@org.com" is already part of property with id "prop".');
    });
  });
});
