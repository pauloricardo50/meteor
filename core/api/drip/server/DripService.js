import { Meteor } from 'meteor/meteor';

import dripNodeJs from 'drip-nodejs';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import UserService from '../../users/server/UserService';

// const ENABLE_API = Meteor.isProduction || Meteor.isTest
const ENABLE_API = true;

const { ACCOUNT_ID, TOKEN } = Meteor?.settings?.drip;
const DRIP_WEBHOOK_ANALYTICS_USER_ID = 'drip_webhook';

const config = function () {
  const endpoints = {
    upsertSubscriber: ({ subscriber }) => ({
      method: 'createUpdateSubscriber',
      params: { subscribers: [subscriber] },
    }),
    deleteSubscriber: ({ subscriber }) => ({
      method: 'deleteSubscriber',
      params: subscriber?.id || subscriber?.email,
    }),
    tagSubscriber: ({ subscriber, tag }) => ({
      method: 'tagSubscriber',
      params: { tags: [{ email: subscriber?.email, tag }] },
    }),
    removeSubscriberTag: ({ subscriber, tag }) => ({
      method: 'removeSubscriberTag',
      params: [subscriber?.email, tag],
    }),
    unsubscribeFromAllMailings: ({ subscriber }) => ({
      method: 'unsubscribeFromAllMailings',
      params: subscriber?.id || subscriber?.email,
    }),
    recordEvent: ({ subscriber, action, properties }) => ({
      method: 'recordEvent',
      params: {
        events: [
          {
            email: subscriber?.email,
            id: subscriber?.id,
            action,
            properties,
          },
        ],
      },
    }),
  };

  const webhookEvents = {
    'subscriber.created': undefined,
    'subscriber.deleted': undefined,
    'subscriber.marked_as_deliverable': undefined,
    'subscriber.subscribed_to_campaign': undefined,
    'subscriber.removed_from_campaign': undefined,
    'subscriber.unsubscribed_from_campaign': undefined,
    'subscriber.unsubscribed_all': undefined,
    'subscriber.reactivated': undefined,
    'subscriber.completed_campaign': undefined,
    'subscriber.applied_tag': undefined,
    'subscriber.removed_tag': undefined,
    'subscriber.updated_custom_field': undefined,
    'subscriber.updated_email_address': undefined,
    'subscriber.updated_lifetime_value': undefined,
    'subscriber.updated_time_zone': undefined,
    'subscriber.received_email': undefined,
    'subscriber.opened_email': undefined,
    'subscriber.clicked_email': undefined,
    'subscriber.bounced': undefined,
    'subscriber.complained': undefined,
    'subscriber.clicked_trigger_link': undefined,
    'subscriber.visited_page': undefined,
    'subscriber.became_lead': undefined,
    'subscriber.became_non_prospect': undefined,
    'subscriber.updated_lead_score': undefined,
    'subscriber.performed_custom_event': undefined,
    'subscriber.updated_alias': undefined,
  };

  const instance = this;
  instance.endpoints = endpoints;
  instance.webhookEvents = webhookEvents;
  instance.dripClient = dripNodeJs({ token: TOKEN, accountId: ACCOUNT_ID });

  Object.keys(endpoints).forEach(endpoint => {
    instance[endpoint] = function (...args) {
      const { method, params } = this.endpoints[endpoint](...args);

      if (!ENABLE_API) {
        return Promise.resolve({});
      }

      return this.dripClient[method](
        ...(Array.isArray(params) ? params : [params]),
      )
        .then(response => response.json())
        .then(console.log)
        .catch(error => {
          ErrorLogger.logError({
            error,
            additionalData: ['Drip Client Error'],
          });
        });
    };
  });
};

export class DripService {
  constructor() {
    config.bind(this)();
  }

  handleWebhook({ body }) {
    const { event, data, Subscriber, custom } = body;

    const method = this.webhookEvents[event || custom?.event];

    return method
      ? this[method](data || { ...custom?.data, subscriber: Subscriber })
      : Promise.resolve();
  }

  checkWebhookAuthentication() {
    // Drip webhooks don't send any authentication data
    return {
      isAuthenticated: true,
      user: {
        _id: DRIP_WEBHOOK_ANALYTICS_USER_ID,
        name: 'Drip webhook',
        organisations: [{ name: 'Drip webhook' }],
      },
    };
  }

  trackAnalyticsEvent({ event, subscriber, additionalProperties = {} }) {
    const { email, id } = subscriber;

    const canFetchUser = subscriber?.email || subscriber?.id;

    const user =
      canFetchUser &&
      UserService.get(
        { $or: [{ _id: id }, { 'emails.address': email }] },
        {
          name: 1,
          email: 1,
          referredByUser: { name: 1 },
          referredByOrganisation: { name: 1 },
          assignedEmployee: { name: 1 },
        },
      );

    if (!user) {
      return;
    }

    const analytics = new Analytics({ userId: user._id });
    return analytics.track(event, {
      userId: user?._id,
      userName: user?.name || subscriber?.name,
      userEmail: user?.email || subscriber?.email,
      referringUserId: user?.referredByUser?._id,
      referringUserName: user?.referredByUser?.name,
      referringOrganisationId: user?.referredByOrganisation?._id,
      referringOrganisationName: user?.referredByOrganisation?.name,
      assigneeId: user?.assignedEmployee?._id,
      assigneeName: user?.assignedEmployee?.name,
      ...additionalProperties,
    });
  }

  async createSubscriber({ userId }) {
    const {
      firstName,
      lastName,
      email,
      phoneNumbers = [],
      assignedEmployee,
      loans = [],
      referredByOrganisation,
    } = UserService.get(userId, {
      firstName: 1,
      lastName: 1,
      email: 1,
      assignedEmployee: { name: 1, email: 1 },
      referredByOrganisation: { name: 1 },
      loans: { promotions: { name: 1 } },
    });

    const hasOnePromotion =
      loans.filter(({ promotions = [] }) => promotions.length).lenght === 1;

    const custom_fields = {
      assigneeEmaildAdress: assignedEmployee?.email,
      assigneeName: assignedEmployee?.name,
      assigneeCalendlyLink: employeesByEmail[assignedEmployee?.email]?.calendly,
      referringOrganisationName: referredByOrganisation?.name,
      promotionName: hasOnePromotion
        ? loans.find(({ promotions = [] }) => promotions.length)?.name
        : undefined,
    };

    const subscriber = {
      email,
      id: userId,
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumbers?.[0],
      custom_fields,
    };

    const res = await this.upsertSubscriber({ subscriber });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_CREATED,
      subscriber,
    });

    return res;
  }

  async updateSubscriber({ userId, object }) {
    const res = await this.upsertSubscriber({
      subscriber: { id: userId, ...object },
    });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_UPDATED,
      subscriber: { id: userId },
    });

    return res;
  }

  async removeSubscriber({ userId }) {
    const res = await this.deleteSubscriber({ subscriber: { id: userId } });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_REMOVED,
      subscriber: { id: userId },
    });

    return res;
  }

  async trackEvent({ event: { action, properties }, userId }) {
    const res = await this.recordEvent({
      action,
      properties,
      subscriber: { id: userId },
    });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_EVENT_RECORDED,
      subscriber: { id: userId },
      additionalProperties: {
        dripEventAction: action,
        dripEventProperties: properties,
      },
    });

    return res;
  }
}

export default new DripService();
