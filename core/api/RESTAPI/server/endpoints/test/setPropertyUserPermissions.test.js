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

import setPropertyUserPermissionsAPI from '../setPropertyUserPermissions';
import { HTTP_STATUS_CODES } from '../../restApiConstants';
import PropertyService from '../../../../properties/server/PropertyService';

const api = new RESTAPI();
api.addEndpoint(
  '/properties/:propertyId/set-user-permissions',
  'POST',
  setPropertyUserPermissionsAPI,
  { rsaAuth: true, endpointName: 'Set property user permissions' },
);

const setPropertyUserPermissions = ({
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
    url: `/properties/${propertyId}/set-user-permissions`,
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

describe('REST: setPropertyUserPermissions', function() {
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
          _id: 'pro',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro@org.com', verified: true }],
          proProperties: {
            _id: 'prop',
            externalId: 'extId',
            category: PROPERTY_CATEGORY.PRO,
            $metadata: {
              permissions: {
                canModifyProperty: true,
                canManagePermissions: true,
              },
            },
          },
        },
        {
          _id: 'pro2',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro2@org.com', verified: true }],
          proProperties: {
            _id: 'prop',
            externalId: 'extId',
            category: PROPERTY_CATEGORY.PRO,
            $metadata: {
              permissions: {
                canModifyProperty: false,
              },
            },
          },
        },
        {
          _id: 'pro3',
          _factory: 'pro',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro3@org.com', verified: true }],
        },
        {
          _id: 'pro4',
          _factory: 'pro',
          organisations: { _id: 'org2' },
          emails: [{ address: 'pro4@org2.com', verified: true }],
          proProperties: {
            _id: 'prop',
            externalId: 'extId',
            category: PROPERTY_CATEGORY.PRO,
          },
        },
      ],
    });
  });

  it('updates user permissions', () => {
    const body = {
      email: 'pro2@org.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then(response => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal(
        'Permissions for user with email "pro2@org.com" on property with id "prop" updated !',
      );
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('updates user from another organisation permissions', () => {
    const body = {
      email: 'pro4@org2.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then(response => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal(
        'Permissions for user with email "pro4@org2.com" on property with id "prop" updated !',
      );
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('updates user permissions with extId', () => {
    const body = {
      email: 'pro2@org.com',
      permissions: {
        canModifyProperty: true,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro',
      propertyId: 'extId',
      body,
    }).then(response => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal(
        'Permissions for user with email "pro2@org.com" on property with id "extId" updated !',
      );
      expect(permissions.canModifyProperty).to.equal(true);
    });
  });

  it('updates user permissions using impersonation', () => {
    const body = {
      email: 'pro@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro2',
      propertyId: 'extId',
      impersonateUser: 'pro@org.com',
      body,
    }).then(response => {
      const { status, message, permissions } = response;
      expect(status).to.equal(HTTP_STATUS_CODES.OK);
      expect(message).to.equal(
        'Permissions for user with email "pro@org.com" on property with id "extId" updated !',
      );
      expect(permissions.canModifyProperty).to.equal(false);
    });
  });

  it('throws if user cannot manage permissions', () => {
    const body = {
      email: 'pro@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    PropertyService.setProUserPermissions({
      propertyId: 'prop',
      userId: 'pro2',
      permissions: { canModifyProperty: true },
    });
    return setPropertyUserPermissions({
      userId: 'pro2',
      propertyId: 'extId',
      body,
    }).then(response => {
      const { message } = response;
      expect(message).to.contain('Vous ne pouvez pas gérer les permissions');
    });
  });

  it('throws if user does not exist', () => {
    const body = {
      email: 'wrong@email.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then(response => {
      const { message } = response;
      expect(message).to.contain('No user found');
    });
  });

  it('throws if property does not exist', () => {
    const body = {
      email: 'pro2@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro',
      propertyId: 'wrongId',
      body,
    }).then(response => {
      const { message } = response;
      expect(message).to.contain('No property found');
    });
  });

  it('throws if user is not on property', () => {
    const body = {
      email: 'pro3@org.com',
      permissions: {
        canModifyProperty: false,
      },
    };
    return setPropertyUserPermissions({
      userId: 'pro',
      propertyId: 'prop',
      body,
    }).then(response => {
      const { message } = response;
      expect(message).to.contain(
        'User with email "pro3@org.com" is not part of property with id "prop". Add it the property before setting his permissions.',
      );
    });
  });
});
