import { Meteor } from 'meteor/meteor';

import dripNodeJs from 'drip-nodejs';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import UserService from '../../users/server/UserService';
import { ACQUISITION_CHANNELS } from '../../users/userConstants';

const IS_TEST = Meteor.isTest;
const IS_PRODUCTION = Meteor.isProduction;

// const ENABLE_API = IS_PRODUCTION || IS_TEST
const ENABLE_API = true;

const { ACCOUNT_ID, TOKEN } = Meteor?.settings?.drip;
const DRIP_WEBHOOK_ANALYTICS_USER_ID = 'drip_webhook';

const config = function () {
  const endpoints = {
    upsertSubscriber: ({ subscriber }) => ({
      method: 'createUpdateSubscriber',
      params: { ...subscriber },
    }),
    deleteSubscriber: ({ subscriber }) => ({
      method: 'deleteSubscriber',
      params: subscriber?.email,
    }),
    fetchSubscriber: ({ subscriber }) => ({
      method: 'fetchSubscriber',
      params: subscriber?.email,
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
      params: subscriber?.email,
    }),
    recordEvent: ({ subscriber, action, properties }) => ({
      method: 'recordEvent',
      params: {
        events: [
          {
            email: subscriber?.email,
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

  const tags = {
    TEST: 'test',
    PROMO: 'promo',
    ORGANIC: 'organic',
    [ACQUISITION_CHANNELS.REFERRAL_API]: 'referral_API',
    [ACQUISITION_CHANNELS.REFERRAL_ORGANIC]: 'referral_organic',
    [ACQUISITION_CHANNELS.REFERRAL_PRO]: 'referral_pro',
  };

  const instance = this;
  instance.endpoints = endpoints;
  instance.webhookEvents = webhookEvents;
  instance.dripClient = dripNodeJs({ token: TOKEN, accountId: ACCOUNT_ID });
  instance.tags = tags;

  Object.keys(endpoints).forEach(endpoint => {
    instance[endpoint] = function (...args) {
      const { method, params } = this.endpoints[endpoint](...args);

      if (!ENABLE_API) {
        return Promise.resolve({});
      }

      return this.dripClient[method](
        ...(Array.isArray(params) ? params : [params]),
      )
        .then(response => response.body)
        .catch(error => {
          ErrorLogger.logError({
            error,
            additionalData: ['Drip Client Error'],
          });
          throw error;
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
    const { email } = subscriber;

    const user = UserService.getByEmail(email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

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

  async createSubscriber({ email }) {
    const user = UserService.getByEmail(email, {
      firstName: 1,
      lastName: 1,
      email: 1,
      assignedEmployee: { name: 1, email: 1 },
      referredByOrganisation: { name: 1 },
      loans: { promotions: { name: 1 } },
      acquisitionChannel: 1,
      phoneNumbers: 1,
    });

    if (!user) {
      throw new Meteor.Error('User not found in database');
    }

    const hasAPromotion =
      user?.loans?.length &&
      user.loans.some(({ promotions = [] }) => promotions.length);
    const hasOnePromotion =
      user?.loans?.length &&
      user.loans.filter(({ promotions = [] }) => promotions.length).length ===
        1;

    // Set tags
    let tags =
      user?.acquisitionChannel === ACQUISITION_CHANNELS.REFERRAL_ADMIN
        ? []
        : [this.tags[user?.acquisitionChannel] || this.tags.ORGANIC];
    if (IS_TEST) {
      tags = [...tags, this.tags.TEST];
    }
    if (hasAPromotion) {
      tags = [...tags, this.tags.PROMO];
    }

    // Set custom fields
    const custom_fields = {
      assigneeEmailAddress: user?.assignedEmployee?.email,
      assigneeName: user?.assignedEmployee?.name,
      assigneeCalendlyLink:
        employeesByEmail[user?.assignedEmployee?.email]?.calendly,
      referringOrganisationName: user?.referredByOrganisation?.name,
      promotionName: hasOnePromotion
        ? user?.loans?.find(({ promotions = [] }) => promotions.length)
            ?.promotions?.[0]?.name
        : undefined,
    };

    const subscriber = {
      email,
      user_id: user?._id,
      first_name: user?.firstName,
      last_name: user?.lastName,
      phone: user?.phoneNumbers?.[0],
      tags,
      custom_fields,
    };

    const res = await this.upsertSubscriber({ subscriber });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_CREATED,
      subscriber,
    });

    return res;
  }

  async updateSubscriber({ email, object }) {
    const res = await this.upsertSubscriber({
      subscriber: { email, ...object },
    });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_UPDATED,
      subscriber: { email },
    });

    return res;
  }

  async removeSubscriber({ email }) {
    const res = await this.deleteSubscriber({ subscriber: { email } });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_REMOVED,
      subscriber: { email },
    });

    return res;
  }

  async trackEvent({ event: { action, properties }, email }) {
    const res = await this.recordEvent({
      action,
      properties,
      subscriber: { email },
    });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_EVENT_RECORDED,
      subscriber: { email },
      additionalProperties: {
        dripEventAction: action,
        dripEventProperties: properties,
      },
    });

    return res;
  }
}

export default new DripService();
