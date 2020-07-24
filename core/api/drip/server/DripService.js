import { Meteor } from 'meteor/meteor';

import dripNodeJs from 'drip-nodejs';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import UserService from '../../users/server/UserService';
import { ACQUISITION_CHANNELS, USER_STATUS } from '../../users/userConstants';
import { DRIP_ACTIONS, DRIP_TAGS } from '../dripConstants';

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
      params: { email: subscriber?.email, tag },
    }),
    // Not used (yet?)
    removeSubscriberTag: ({ subscriber, tag }) => ({
      method: 'removeSubscriberTag',
      params: [subscriber?.email, tag],
    }),
    // Not used (yet?)
    unsubscribeFromAllMailings: ({ subscriber }) => ({
      method: 'unsubscribeFromAllMailings',
      params: subscriber?.email,
    }),
    recordEvent: ({ subscriber, action, properties }) => ({
      method: 'recordEvent',
      params: {
        email: subscriber?.email,
        action,
        properties,
      },
    }),
  };

  // This is the list of all webhooks sent by Drip
  // 'undefined' webhooks are not (yet?) handled by our backend
  const webhookEvents = {
    'subscriber.created': undefined,
    'subscriber.deleted': 'handleDeleted',
    'subscriber.marked_as_deliverable': undefined,
    'subscriber.subscribed_to_campaign': undefined,
    'subscriber.removed_from_campaign': undefined,
    'subscriber.unsubscribed_from_campaign': 'handleUnsubscribe',
    'subscriber.unsubscribed_all': 'handleUnsubscribe',
    'subscriber.reactivated': undefined,
    'subscriber.completed_campaign': undefined,
    'subscriber.applied_tag': 'handleAppliedTag',
    'subscriber.removed_tag': undefined,
    'subscriber.updated_custom_field': undefined,
    'subscriber.updated_email_address': undefined,
    'subscriber.updated_lifetime_value': undefined,
    'subscriber.updated_time_zone': undefined,
    'subscriber.received_email': 'handleReceivedEmail',
    'subscriber.opened_email': 'handleOpenedEmail',
    'subscriber.clicked_email': 'handleClickedEmail',
    'subscriber.bounced': 'handleBounced',
    'subscriber.complained': 'handleComplained',
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
  instance.tags = DRIP_TAGS;

  Object.keys(endpoints).forEach(endpoint => {
    instance[endpoint] = function (...args) {
      const { method, params } = this.endpoints[endpoint](...args);

      return this.callDripAPI(method, params);
    };
  });
};

export class DripService {
  constructor({ enableAPI = ENABLE_API }) {
    config.bind(this)();
    this.enableAPI = enableAPI;
  }

  // Useful for test stubs
  callDripAPI(method, params) {
    if (!this.enableAPI) {
      return Promise.resolve({});
    }

    return this.dripClient[method](
      ...(Array.isArray(params) ? params : [params]),
    )
      .then(response => {
        // Append the status to the body for the tests
        const { body, statusCode: status } = response;
        return { ...body, status };
      })
      .catch(error => {
        ErrorLogger.logError({
          error,
          additionalData: ['Drip Client Error'],
        });
        throw error;
      });
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

    // Subscribers with 'test' tag get removed by our Drip workflow 10 minutes after they are created
    if (!IS_PRODUCTION) {
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

    // Response should be a 204 No Content, no need to append it to the returned result
    await this.trackEvent({
      event: { action: DRIP_ACTIONS.USER_CREATED },
      email,
    });

    return res;
  }

  // Note from Drip: Concurrently updating the same subscriber via multiple API calls is not supported
  // and will fail with a rate limit error and the message "Too many concurrent requests for the same subscriber".
  // You should retry the call after a short wait period to let the other requests to the same subscriber complete.
  // Triggering this rate limit does not mean you've consumed your overall API rate limited capacity.
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

  async handleAppliedTag(data) {
    const { subscriber, properties } = data;

    const tag = properties?.tag;

    // This tag is not handled by our backend
    if (!Object.values(this.tags).includes(tag)) {
      return Promise.resolve();
    }

    let event;
    const user = UserService.getByEmail(subscriber?.email, { _id: 1 });

    switch (tag) {
      case this.tags.LOST: {
        event = EVENTS.DRIP_SUBSCRIBER_LOST;

        if (user?._id) {
          UserService.setStatus({
            userId: user?._id,
            status: USER_STATUS.LOST,
          });
        }
        break;
      }
      case this.tags.QUALIFIED: {
        event = EVENTS.DRIP_SUBSCRIBER_QUALIFIED;

        if (user?._id) {
          UserService.setStatus({
            userId: user?._id,
            status: USER_STATUS.QUALIFIED,
          });
        }
        break;
      }

      case this.tags.CALENDLY: {
        event = EVENTS.DRIP_SUBSCRIBER_QUALIFIED;

        if (user?._id) {
          UserService.setStatus({
            userId: user?._id,
            status: USER_STATUS.QUALIFIED,
          });
        }

        await this.trackAnalyticsEvent({
          event: EVENTS.DRIP_SUBSCRIBER_BOOKED_AN_EVENT,
          subscriber,
        });
        break;
      }
      default:
        break;
    }

    if (event) {
      await this.trackAnalyticsEvent({
        event,
        subscriber,
      });
    }

    return Promise.resolve();
  }

  async handleDeleted(data) {
    const { subscriber } = data;

    const user = UserService.getByEmail(subscriber?.email, { _id: 1 });

    if (user?._id) {
      UserService.setStatus({ userId: user?._id, status: USER_STATUS.LOST });
    }

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_REMOVED,
      subscriber,
    });

    return Promise.resolve();
  }

  async handleUnsubscribe(data) {
    const { subscriber } = data;

    const user = UserService.getByEmail(subscriber?.email, { _id: 1 });

    if (user?._id) {
      UserService.setStatus({ userId: user?._id, status: USER_STATUS.LOST });
    }

    await this.tagSubscriber({ subscriber, tag: this.tags.LOST });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_UNSUBSCRIBED,
      subscriber,
    });

    return Promise.resolve();
  }

  async handleReceivedEmail(data) {
    // TODO: add email activity
    const { subscriber, properties } = data;

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_RECEIVED_EMAIL,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });

    return Promise.resolve();
  }

  async handleOpenedEmail(data) {
    const { subscriber, properties } = data;

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_OPENED_EMAIL,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });

    return Promise.resolve();
  }

  async handleClickedEmail(data) {
    const { subscriber, properties } = data;

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_CLICKED_EMAIL,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
        dripEmailUrl: properties?.url,
      },
    });

    return Promise.resolve();
  }

  async handleBounced(data) {
    const { subscriber, properties } = data;

    const user = UserService.getByEmail(subscriber?.email, { _id: 1 });

    if (user?._id) {
      UserService.setStatus({ userId: user?._id, status: USER_STATUS.LOST });
    }

    await this.tagSubscriber({ subscriber, tag: this.tags.LOST });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_BOUNCED,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });

    return Promise.resolve();
  }

  async handleComplained(data) {
    const { subscriber, properties } = data;

    const user = UserService.getByEmail(subscriber?.email, { _id: 1 });

    if (user?._id) {
      UserService.setStatus({ userId: user?._id, status: USER_STATUS.LOST });
    }

    await this.tagSubscriber({ subscriber, tag: this.tags.LOST });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_COMPLAINED,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });

    return Promise.resolve();
  }
}

export default new DripService({});
