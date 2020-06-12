import { Meteor } from 'meteor/meteor';

import crypto from 'crypto';
import nodeFetch from 'node-fetch';

import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';

const ENABLE_API = Meteor.isProduction;
// const ENABLE_API = true;

const APP_ID = 'fzxlw28z';

// TODO:Put these in secrets manager
const IDENTITY_VERIFICATION_SECRET = 'AR5jRm9Amz-1odTHjRWdOUbI-f4wzyglPsk_D993';
const ACCESS_TOKEN =
  'dG9rOmUxYWNhZGY3XzI2ODNfNDM5Zl9hOGRjXzA4MDM3ZjM5MzBlNDoxOjA=';

const API_PATH = 'https://api.intercom.io';

const intercomEndpoints = {
  searchContacts: {
    method: 'POST',
    makeEndpoint: () => '/contacts/search',
  },
  updateContact: {
    method: 'PUT',
    makeEndpoint: ({ contactId }) => `/contacts/${contactId}`,
  },
  listAdmins: {
    method: 'GET',
    makeEndpoint: () => '/admins',
  },
  getContact: {
    method: 'GET',
    makeEndpoint: ({ contactId }) => `/contacts/${contactId}`,
  },
};

export class IntercomService {
  constructor({ fetch, isEnabled }) {
    this.isEnabled = isEnabled;
    this.fetch = fetch;
  }

  getIntercomSettings({ userId }) {
    let result = { app_id: APP_ID };

    if (userId) {
      const { email, name, phoneNumbers = [] } = UserService.get(userId, {
        email: 1,
        name: 1,
        phoneNumbers: 1,
      });
      const hmac = crypto.createHmac('sha256', IDENTITY_VERIFICATION_SECRET);
      hmac.update(email);
      const digest = hmac.digest('hex');

      result = {
        ...result,
        email,
        name,
        phone: phoneNumbers[0],
        user_hash: digest,
      };
    }

    return result;
  }

  handleFetch(...args) {
    // Do this to easily stub fetch in tests
    return this.fetch(...args);
  }

  callIntercomAPI({ endpoint, params, body }) {
    const endpointConfig = intercomEndpoints[endpoint];

    if (!endpointConfig) {
      throw new Error(`Invalid endpoint config ${endpoint}`);
    }

    const { method, makeEndpoint } = endpointConfig;

    const path = API_PATH + makeEndpoint(params);

    if (!this.isEnabled) {
      console.log("Would've called Intercom API", endpoint);
      console.log('params:', params);
      console.log('body:', body);

      return Promise.resolve({});
    }

    return this.handleFetch(path, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
      .then(async result => {
        try {
          const response = await result.text();
          return JSON.parse(response);
        } catch (e) {
          return {};
        }
      })
      .then(result => {
        console.log('callIntercomAPI result:', endpoint);
        console.log('params:', params);
        console.log('result:', result);
        return result;
      })
      .catch(error => {
        console.log('IntercomAPI error:', error);
        throw error;
      });
  }

  getContact = async ({ email, contactId }) => {
    let contact = {};

    if (email) {
      const body = {
        query: {
          field: 'email',
          operator: '=',
          value: email,
        },
      };

      const { data = [] } = await this.callIntercomAPI({
        endpoint: 'searchContacts',
        body,
      });

      contact = data[0];
    }

    if (contactId) {
      contact = await this.callIntercomAPI({
        endpoint: 'getContact',
        params: { contactId },
      });
    }

    return contact;
  };

  listAdmins = async () => {
    const { admins = [] } = await this.callIntercomAPI({
      endpoint: 'listAdmins',
    });
    return admins;
  };

  getAdmin = async ({ email }) => {
    const admins = this.listAdmins();
    const [admin = {}] = admins.find(
      ({ email: adminEmail }) => email === adminEmail,
    );

    return admin;
  };

  getIntercomId = async ({ userId }) => {
    let { email, assignedRoles, intercomId } = UserService.get(userId, {
      email: 1,
      assignedRoles: 1,
    });

    if (intercomId) {
      return intercomId;
    }

    const [role] = assignedRoles;

    if (role === ROLES.ADVISOR) {
      intercomId = await this.getAdminId({ email })?._id;
    } else {
      intercomId = await this.getContact({ email })?._id;
    }

    if (intercomId) {
      UserService.update({ userId, object: { intercomId } });
    }

    return intercomId;
  };

  updateContactOwner = async ({ userId, adminId }) => {
    const contactId = await this.getIntercomId({ userId });
    const adminIntercomId = await this.getIntercomId({ userId: adminId });

    if (!contactId) {
      throw new Error(
        `No contact found on intercom for user with id "${userId}"`,
      );
    }

    if (!adminIntercomId) {
      throw new Error(
        `No admin found on intercom for admin with id "${adminId}"`,
      );
    }

    return this.callIntercomAPI({
      endpoint: 'updateContact',
      params: { contactId },
      body: {
        owner_id: adminIntercomId,
      },
    });
  };
}

export default new IntercomService({ fetch: nodeFetch, isEnabled: ENABLE_API });
