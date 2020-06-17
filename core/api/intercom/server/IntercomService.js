import { Meteor } from 'meteor/meteor';

import crypto from 'crypto';
import nodeFetch from 'node-fetch';

import { TRACKING_COOKIE } from '../../analytics/analyticsConstants';
import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import { ERROR_CODES } from '../../errors';
import SessionService from '../../sessions/server/SessionService';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';

const ENABLE_API = Meteor.isProduction;
// const ENABLE_API = true;

const APP_ID = 'fzxlw28z';

// TODO:Put these in secrets manager
const IDENTITY_VERIFICATION_SECRET = 'AR5jRm9Amz-1odTHjRWdOUbI-f4wzyglPsk_D993';
const ACCESS_TOKEN =
  'dG9rOmUxYWNhZGY3XzI2ODNfNDM5Zl9hOGRjXzA4MDM3ZjM5MzBlNDoxOjA=';
export const CLIENT_SECRET = '8aa9e62d-f979-4dfc-ac8c-f4c36bc8eabf';

const API_PATH = 'https://api.intercom.io';
const INTERCOM_WEBHOOK_ANALYTICS_USER_ID = 'intercom_webhook';

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
  updateVisitor: {
    method: 'PUT',
    makeEndpoint: () => '/visitors',
  },
  assignConversation: {
    method: 'POST',
    makeEndpoint: ({ conversationId }) =>
      `/conversations/${conversationId}/parts`,
  },
};

const WEBHOOK_TOPICS = {
  USER_STARTED_CONVERSATION: {
    topic: 'conversation.user.created',
    method: 'handleNewConversation',
  },
  USER_REPLIED: {
    topic: 'conversation.user.replied',
    method: 'handleUserResponse',
  },
  ADMIN_REPLIED: {
    topic: 'conversation.admin.replied',
    method: 'handleAdminResponse',
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
        ErrorLogger.logError({ error, additionalData: ['IntercomAPI error'] });
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
      return contact;
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

  async updateVisitorTrackingId({ context, visitorId, cookies = {} }) {
    const isImpersonating = SessionService.isImpersonatedSession(
      context?.connection?.id,
    );

    const trackingId = cookies[TRACKING_COOKIE];

    const userId =
      visitorId ||
      Object.keys(cookies).reduce(
        (id, cookie) => (cookie.match(/intercom-id/g) ? cookies[cookie] : id),
        undefined,
      );

    if (isImpersonating || !userId || !trackingId) {
      return;
    }

    return this.callIntercomAPI({
      endpoint: 'updateVisitor',
      body: {
        user_id: userId,
        custom_attributes: { [TRACKING_COOKIE]: trackingId },
      },
    });
  }

  checkWebhookAuthentication(req) {
    const signature = req?.headers?.['x-hub-signature'];
    const data = req?.body;

    const isValid = this.validateIntercomSignature(data, signature);

    return {
      isAuthenticated: isValid,
      error:
        !isValid &&
        new Meteor.Error(
          ERROR_CODES.UNAUTHORIZED,
          'Intercom signature verification failed',
        ),
      user: {
        _id: INTERCOM_WEBHOOK_ANALYTICS_USER_ID,
        name: 'Intercom webhook',
        organisations: [{ name: 'Intercom webhook' }],
      },
    };
  }

  validateIntercomSignature(data, rawSignature) {
    const signature = rawSignature.replace('sha1=', '');
    const hash = crypto
      .createHmac('sha1', CLIENT_SECRET)
      .update(JSON.stringify(data))
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  }

  handleWebhook({ body }) {
    const { data: { item } = {}, topic } = body;

    const method = Object.values(WEBHOOK_TOPICS).find(
      ({ topic: t }) => t === topic,
    )?.method;

    return method ? this[method](item) : Promise.resolve();
  }

  async assignConversation({ conversationId, assigneeId }) {
    return this.callIntercomAPI({
      endpoint: 'assignConversation',
      params: { conversationId },
      body: {
        type: 'admin',
        admin_id: assigneeId,
        assignee_id: assigneeId,
        message_type: 'assignment',
      },
    });
  }

  async handleNewConversation(conversation) {
    const {
      id: conversationId,
      user: { id: contactId, email: contactEmail } = {},
      assignee: { id: assigneeId } = {},
    } = conversation;

    const contact = contactId
      ? await this.getContact({ contactId })
      : await this.getContact({ email: contactEmail });

    const trackingId = contact?.custom_attributes?.epotek_trackingid;

    if (trackingId) {
      const analytics = new Analytics();
      analytics.track(EVENTS.INTERCOM_STARTED_A_CONVERSATION, {}, trackingId);
    }

    if (assigneeId) {
      return this.callIntercomAPI({
        endpoint: 'updateContact',
        params: { contactId },
        body: { owner_id: assigneeId },
      });
    }

    const user =
      !contact?.owner_id &&
      contactEmail &&
      UserService.getByEmail(contactEmail, {
        assignedEmployee: { intercomId: 1 },
      });

    const assignedEmployeeIntercomId = user?.assignedEmployee?.intercomId;

    const assignee = contact?.owner_id || assignedEmployeeIntercomId;

    if (assignee) {
      return this.assignConversation({ conversationId, assigneeId: assignee });
    }

    return Promise.resolve();
  }

  async handleAdminResponse(conversation) {
    // Conversation should automatically be assigned to replying admin
    const {
      user: { id: contactId } = {},
      assignee: { id: assigneeId } = {},
    } = conversation;

    const contact = await this.getContact({ contactId });
    const assignee = UserService.get({ intercomId: assigneeId }, { name: 1 });

    const trackingId = contact?.custom_attributes?.epotek_trackingid;

    if (trackingId) {
      const analytics = new Analytics();
      analytics.track(
        EVENTS.INTERCOM_RECEIVED_ADMIN_RESPONSE,
        {
          assigneeId: assignee?._id,
          assigneeName: assignee?.name,
        },
        trackingId,
      );
    }

    if (contactId && assigneeId) {
      return this.callIntercomAPI({
        endpoint: 'updateContact',
        params: { contactId },
        body: { owner_id: assigneeId },
      });
    }

    return Promise.resolve();
  }

  async handleUserResponse(conversation) {
    const {
      user: { id: contactId } = {},
      assignee: { id: assigneeId } = {},
    } = conversation;

    const contact = await this.getContact({ contactId });
    const assignee = UserService.get({ intercomId: assigneeId }, { name: 1 });

    const trackingId = contact?.custom_attributes?.epotek_trackingid;

    if (trackingId) {
      const analytics = new Analytics();
      analytics.track(
        EVENTS.INTERCOM_SENT_A_MESSAGE,
        {
          assigneeId: assignee?._id,
          assigneeName: assignee?.name,
        },
        trackingId,
      );
    }
  }
}

export default new IntercomService({ fetch: nodeFetch, isEnabled: ENABLE_API });
