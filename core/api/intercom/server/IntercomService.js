import { Meteor } from 'meteor/meteor';

import crypto from 'crypto';
import nodeFetch from 'node-fetch';

import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import { ERROR_CODES } from '../../errors';
import SessionService from '../../sessions/server/SessionService';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';

const ENABLE_API = Meteor.isProduction || Meteor.isTest;
// const ENABLE_API = true;

// const APP_ID = 'fzxlw28z';

// TODO:Put these in secrets manager
// const IDENTITY_VERIFICATION_SECRET = 'AR5jRm9Amz-1odTHjRWdOUbI-f4wzyglPsk_D993';
// const ACCESS_TOKEN =
//   'dG9rOmUxYWNhZGY3XzI2ODNfNDM5Zl9hOGRjXzA4MDM3ZjM5MzBlNDoxOjA=';
// export const CLIENT_SECRET = '8aa9e62d-f979-4dfc-ac8c-f4c36bc8eabf';

const API_PATH = 'https://api.intercom.io';
const INTERCOM_WEBHOOK_ANALYTICS_USER_ID = 'intercom_webhook';

const {
  APP_ID,
  IDENTITY_VERIFICATION_SECRET,
  ACCESS_TOKEN,
  CLIENT_SECRET,
} = Meteor?.settings?.intercom;

const config = function () {
  const endpoints = {
    searchContacts: ({ filters = {}, operator = 'AND' }) => {
      const fields = Object.keys(filters);

      const body = {
        query: {
          operator,
          value: fields.map(field => ({
            field,
            operator: filters[field].operator || '=',
            value: filters[field].value,
          })),
        },
      };

      return {
        method: 'POST',
        path: '/contacts/search',
        body,
      };
    },
    getContact: ({ contactId }) => ({
      method: 'GET',
      path: `/contacts/${contactId}`,
    }),
    updateContact: ({ contactId, ...body }) => ({
      method: 'PUT',
      path: `/contacts/${contactId}`,
      body,
    }),
    listAdmins: () => ({
      method: 'GET',
      path: '/admins',
    }),
    getVisitor: ({ visitorId }) => ({
      method: 'GET',
      path: `/visitors?user_id=${visitorId}`,
    }),
    updateVisitor: ({ visitorId, ...body }) => ({
      method: 'PUT',
      path: '/visitors/update',
      body: { user_id: visitorId, ...body },
    }),
    assignConversation: ({ conversationId, assigneeId, adminId }) => ({
      method: 'POST',
      path: `/conversations/${conversationId}/parts`,
      body: {
        type: 'admin',
        admin_id: adminId || assigneeId,
        assignee_id: assigneeId,
        message_type: 'assignment',
      },
    }),
  };

  const webhookTopics = {
    'conversation.user.created': 'handleNewConversation',
    'conversation.user.replied': 'handleUserResponse',
    'conversation.admin.replied': 'handleAdminResponse',
  };

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  const instance = this;
  instance.endpoints = endpoints;
  instance.webhookTopics = webhookTopics;

  Object.keys(endpoints).forEach(endpoint => {
    instance[endpoint] = function (...args) {
      const { method, path, body } = this.endpoints[endpoint](...args);

      if (!ENABLE_API) {
        return Promise.resolve({});
      }

      return nodeFetch(API_PATH + path, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      })
        .then(result => result.json())
        .then(result => {
          const { errors = [] } = result;
          if (errors.length) {
            ErrorLogger.logError({
              error: new Error(errors?.[0]?.message),
              additionalData: ['IntercomAPI error'],
            });
            return undefined;
          }

          return result;
        })
        .catch(error => {
          ErrorLogger.logError({
            error,
            additionalData: ['IntercomAPI error'],
          });
          throw error;
        });
    };
  });
};

export class IntercomService {
  constructor() {
    config.bind(this)();
  }

  async getIntercomSettings({ userId }) {
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
        await this.updateContactOwner({ userId, adminId: assignedEmployeeId });
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

  async getIntercomId({ userId }) {
    const { intercomId, email, assignedRoles } = UserService.get(userId, {
      intercomId: 1,
      email: 1,
      assignedRoles: 1,
    });

    if (intercomId) {
      return intercomId;
    }

    const [role] = assignedRoles;
    let contact;
    if (role === ROLES.ADVISOR) {
      contact = await this.getAdmin({ email });
    } else {
      contact = await this.getContactByEmail({ email });
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

    return this.updateContact({ contactId, owner_id: adminIntercomId });
  }

  async getAdmin({ email }) {
    const { admins = [] } = await this.listAdmins();
    const admin = admins.find(({ email: adminEmail }) => email === adminEmail);

    return admin;
  }

  async getContactByEmail({ email }) {
    const { data = [] } = await this.searchContacts({
      filters: { email: { value: email } },
    });
    return data[0];
  }

  async getContactByVisitorId({ visitorId }) {
    const { data = [] } = await this.searchContacts({
      filters: { external_id: { value: visitorId } },
    });
    return data[0];
  }

  async updateVisitorTrackingId({
    context,
    visitorId,
    trackingId,
    intercomId,
  }) {
    const isImpersonating = SessionService.isImpersonatedSession(
      context?.connection?.id,
    );

    const userId = visitorId || intercomId;

    if (isImpersonating || !userId || !trackingId) {
      return;
    }

    let visitor;
    visitor = await this.getVisitor({ visitorId: userId });

    // Visitor not found, try to fetch the contact
    if (!visitor) {
      visitor = await this.getContactByVisitorId({ visitorId: userId });
    }

    const visitorType = visitor?.type;
    const visitorIsFound = !!visitor;

    if (!visitorIsFound || visitor?.custom_attributes?.epotek_trackingid) {
      return;
    }

    if (visitorType === 'visitor') {
      return this.updateVisitor({
        visitorId: userId,
        custom_attributes: { epotek_trackingid: trackingId },
      });
    }
    if (visitorType === 'contact') {
      return this.updateContact({
        contactId: visitor.id,
        custom_attributes: { epotek_trackingid: trackingId },
      });
    }
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

    const method = this.webhookTopics[topic];

    return method ? this[method](item) : Promise.resolve();
  }

  trackEvent({ event, contact, email, additionalProperties = {} }) {
    const trackingId = contact?.custom_attributes?.epotek_trackingid;

    if (!trackingId) {
      return;
    }

    const user =
      email &&
      UserService.getByEmail(email, {
        name: 1,
        email: 1,
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { intercomId: 1, name: 1 },
      });

    const analytics = new Analytics();
    analytics.track(
      event,
      {
        userId: user?._id,
        userName: user?.name || contact?.name,
        userEmail: user?.email || email,
        referringUserId: user?.referredByUser?._id,
        referringUserName: user?.referredByUser?.name,
        referringOrganisationId: user?.referredByOrganisation?._id,
        referringByOrganisationName: user?.referredByOrganisation?.name,
        assigneeId: user?.assignedEmployee?._id,
        assigneeName: user?.assignedEmployee?.name,
        ...additionalProperties,
      },
      trackingId,
    );
  }

  async handleNewConversation(conversation) {
    const {
      id: conversationId,
      user: { id: contactId, email: contactEmail } = {},
      assignee: { id: assigneeId } = {},
    } = conversation;

    const contact = contactId
      ? await this.getContact({ contactId })
      : await this.getContactByEmail({ email: contactEmail });

    this.trackEvent({
      event: EVENTS.INTERCOM_STARTED_A_CONVERSATION,
      contact,
      email: contactEmail,
    });

    const user =
      contactEmail &&
      UserService.getByEmail(contactEmail, {
        assignedEmployee: { intercomId: 1, name: 1 },
      });

    if (assigneeId) {
      return this.updateContact({ contactId, owner_id: assigneeId });
    }

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
      user: { id: contactId, email: contactEmail } = {},
      assignee: { id: assigneeId } = {},
    } = conversation;

    const contact = await this.getContact({ contactId });
    const admin = UserService.get({ intercomId: assigneeId }, { name: 1 });

    this.trackEvent({
      event: EVENTS.INTERCOM_RECEIVED_ADMIN_RESPONSE,
      contact,
      email: contactEmail,
      additionalProperties: {
        answeringAdminId: admin?._id,
        answeringAdminName: admin?.name,
      },
    });

    if (contactId && assigneeId) {
      return this.updateContact({ contactId, owner_id: assigneeId });
    }

    return Promise.resolve();
  }

  async handleUserResponse(conversation) {
    const { user: { id: contactId, email: contactEmail } = {} } = conversation;

    const contact = await this.getContact({ contactId });
    this.trackEvent({
      event: EVENTS.INTERCOM_SENT_A_MESSAGE,
      contact,
      email: contactEmail,
    });

    return Promise.resolve();
  }
}

export default new IntercomService();
