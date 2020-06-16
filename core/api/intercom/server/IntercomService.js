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
  constructor({ fetch, isEnabled, id }) {
    this.isEnabled = isEnabled;
    this.fetch = fetch;
    this.getContact.id = id;
  }

  getIntercomSettings({ userId }) {
    let result = { app_id: APP_ID };

    if (userId) {
      const {
        email,
        name,
        phoneNumbers = [],
        intercomId,
        assignedEmployeeId,
      } = UserService.get(userId, {
        email: 1,
        name: 1,
        phoneNumbers: 1,
        intercomId: 1,
        assignedEmployeeId: 1,
      });
      const hmac = crypto.createHmac('sha256', IDENTITY_VERIFICATION_SECRET);
      hmac.update(email);
      const digest = hmac.digest('hex');

      // If user has no intercomId yet
      // it means that his owner is not set on intercom
      if (!intercomId && assignedEmployeeId) {
        this.updateContactOwner({ userId, adminId: assignedEmployeeId });
      }

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
      .catch(error => {
        console.log('IntercomAPI error:', error);
        throw error;
      });
  }

  async getContact({ email, contactId }) {
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

      const [contact] = data;
      return contact || {};
    }
    if (contactId) {
      return this.callIntercomAPI({
        endpoint: 'getContact',
        params: { contactId },
      });
    }
  }

  async listAdmins() {
    const { admins = [] } = await this.callIntercomAPI({
      endpoint: 'listAdmins',
    });
    return admins;
  }

  async getAdmin({ email }) {
    const admins = await this.listAdmins();
    const admin = admins.find(({ email: adminEmail }) => email === adminEmail);

    return admin || {};
  }

  async getIntercomId({ userId }) {
    const { intercomId } = UserService.get(userId, {
      intercomId: 1,
    });

    if (intercomId) {
      return intercomId;
    }

    const contactId = await this.setIntercomId({ userId });
    return contactId;
  }

  async setIntercomId({ userId }) {
    const { email, assignedRoles } = UserService.get(userId, {
      email: 1,
      assignedRoles: 1,
    });

    const [role] = assignedRoles;
    let contact;

    if (role === ROLES.ADVISOR) {
      contact = await this.getAdmin({ email });
    } else {
      contact = await this.getContact({ email });
    }

    if (contact?.id) {
      UserService.update({ userId, object: { intercomId: contact.id } });
    }

    return contact?.id;
  }

  async updateContactOwner({ userId, adminId }) {
    const contactId = await this.getIntercomId({ userId });
    const adminIntercomId = await this.getIntercomId({ userId: adminId });

    if (!contactId || !adminIntercomId) {
      return;
    }

    return this.callIntercomAPI({
      endpoint: 'updateContact',
      params: { contactId },
      body: {
        owner_id: adminIntercomId,
      },
    });
  }
}

export default new IntercomService({ fetch: nodeFetch, isEnabled: ENABLE_API });
