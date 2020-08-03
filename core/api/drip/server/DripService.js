import { Meteor } from 'meteor/meteor';

import dripNodeJs from 'drip-nodejs';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import { UNSUCCESSFUL_LOAN_REASONS } from '../../loans/loanConstants';
import { setUserStatus } from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import { ACQUISITION_CHANNELS, USER_STATUS } from '../../users/userConstants';
import { DRIP_ACTIONS, DRIP_TAGS } from '../dripConstants';

const IS_TEST = Meteor.isTest;
const IS_PRODUCTION = Meteor.isProduction;

const ENABLE_API = IS_PRODUCTION || IS_TEST;
// const ENABLE_API = true;

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
    this.enableAPI = ENABLE_API && enableAPI;
  }

  // Useful for test stubs
  callDripAPI(method, params) {
    if (!this.enableAPI) {
      return Promise.resolve({});
    }

    const arrayifiedParams = Array.isArray(params) ? params : [params];

    return this.dripClient[method](...arrayifiedParams)
      .then(response => {
        // Append the status to the body for the tests
        const { body, statusCode: status } = response;
        return { ...body, status };
      })
      .catch(error => {
        ErrorLogger.logError({
          error: error.message,
          additionalData: ['Drip Service Error', ...arrayifiedParams],
        });
        throw error;
      });
  }

  handleWebhook({ body }) {
    const { event, data, Subscriber, custom } = body;

    const method = this.webhookEvents[event || custom?.event];

    const subscriber = data?.subscriber || Subscriber;

    const hasTestTag = subscriber?.tags?.includes?.(this.tags.TEST);

    // Avoid tests calls to be processed on production backend
    if (hasTestTag) {
      return Promise.resolve();
    }

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

  trackAnalyticsEvent({ event, subscriber, additionalProperties = {}, user }) {
    const analyticsUser =
      user ||
      UserService.getByEmail(subscriber?.email, {
        name: 1,
        email: 1,
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { name: 1 },
      });

    if (!analyticsUser) {
      return;
    }

    const analytics = new Analytics({ userId: analyticsUser._id });
    return analytics.track(event, {
      userId: analyticsUser?._id,
      userName: analyticsUser?.name || subscriber?.name,
      userEmail: analyticsUser?.email || subscriber?.email,
      referringUserId: analyticsUser?.referredByUser?._id,
      referringUserName: analyticsUser?.referredByUser?.name,
      referringOrganisationId: analyticsUser?.referredByOrganisation?._id,
      referringOrganisationName: analyticsUser?.referredByOrganisation?.name,
      assigneeId: analyticsUser?.assignedEmployee?._id,
      assigneeName: analyticsUser?.assignedEmployee?.name,
      ...additionalProperties,
    });
  }

  async createSubscriber({ email }) {
    const user = UserService.getByEmail(email, {
      firstName: 1,
      lastName: 1,
      name: 1,
      email: 1,
      assignedEmployee: { name: 1, email: 1 },
      referredByOrganisation: { name: 1 },
      referredByUser: { name: 1, email: 1, organisations: { name: 1 } },
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

    let referringOrganisationName;

    if (hasOnePromotion) {
      const invitedBy = user?.loans?.[0]?.promotions?.[0].$metadata?.invitedBy;
      const pro =
        invitedBy && UserService.get(invitedBy, { organisations: { name: 1 } });
      referringOrganisationName = pro?.organisations?.find(
        ({ $metadata: { isMain } }) => isMain,
      )?.name;
    } else {
      referringOrganisationName =
        user?.referredByUser?.organisations?.find(
          ({ $metadata: { isMain } }) => isMain,
        )?.name || user?.referredByOrganisation?.name;
    }

    // Set custom fields
    const custom_fields = {
      assigneeEmailAddress: user?.assignedEmployee?.email,
      assigneeName: user?.assignedEmployee?.name,
      assigneeCalendlyLink:
        employeesByEmail[user?.assignedEmployee?.email]?.calendly,
      assigneeJobTitle: employeesByEmail[user?.assignedEmployee?.email]?.title,
      assigneePhone:
        employeesByEmail[user?.assignedEmployee?.email]?.phoneNumber,
      referringOrganisationName,
      referringUserEmail: user?.referredByUser?.email,
      referringUserName: user?.referredByUser?.name,
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
      user,
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
        ...(properties || {}),
        dripEventAction: action,
        dripEventProperties: properties,
      },
    });

    return res;
  }

  async handleAppliedTag({ subscriber, properties }) {
    const tag = properties?.tag;

    // This tag is not handled by our backend
    if (!Object.values(this.tags).includes(tag)) {
      return;
    }

    let event;
    let additionalProperties;
    const user = UserService.getByEmail(subscriber?.email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    switch (tag) {
      case this.tags.LOST: {
        event = EVENTS.DRIP_SUBSCRIBER_LOST;
        additionalProperties = { lostReason: 'Webhook: Drip applied LOST tag' };

        if (user?._id) {
          setUserStatus.serverRun({
            userId: user?._id,
            status: USER_STATUS.LOST,
            source: 'drip',
            reason: 'Webhook: Drip applied LOST tag',
            unsuccessfulReason:
              UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_NO_ANSWER,
          });
        }
        break;
      }
      case this.tags.QUALIFIED: {
        event = EVENTS.DRIP_SUBSCRIBER_QUALIFIED;
        additionalProperties = {
          qualifyReason: 'Webhook: Drip applied QUALIFIED tag',
        };

        if (user?._id) {
          setUserStatus.serverRun({
            userId: user?._id,
            status: USER_STATUS.QUALIFIED,
            source: 'drip',
            reason: 'Webhook: Drip applied QUALIFIED tag',
          });
        }
        break;
      }

      case this.tags.CALENDLY: {
        event = EVENTS.DRIP_SUBSCRIBER_QUALIFIED;
        additionalProperties = {
          qualifyReason: 'Webhook: Drip applied CALENDLY tag',
        };

        if (user?._id) {
          setUserStatus.serverRun({
            userId: user?._id,
            status: USER_STATUS.QUALIFIED,
            source: 'drip',
            reason: 'Subscriber booked an event on Calendly',
          });

          ActivityService.addServerActivity({
            title: 'A booké un rendez-vous sur Calendly',
            type: ACTIVITY_TYPES.EVENT,
            userLink: { _id: user._id },
            metadata: { event: ACTIVITY_EVENT_METADATA.USER_BOOKED_CALENDLY },
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
        user,
        additionalProperties,
      });
    }
  }

  async handleDeleted({ subscriber }) {
    const user = UserService.getByEmail(subscriber?.email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    if (user?._id) {
      setUserStatus.serverRun({
        userId: user?._id,
        status: USER_STATUS.LOST,
        source: 'drip',
        reason: 'Subscriber deleted',
      });
    }

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_REMOVED,
      subscriber,
      user,
      additionalProperties: {
        removeReason: 'Webhook: Subscriber deleted on drip',
      },
    });
  }

  async handleUnsubscribe({ subscriber }) {
    const user = UserService.getByEmail(subscriber?.email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    if (user?._id) {
      setUserStatus.serverRun({
        userId: user?._id,
        status: USER_STATUS.LOST,
        source: 'drip',
        reason: 'Subscriber unsubscribed',
        unsuccessfulReason: UNSUCCESSFUL_LOAN_REASONS.DRIP_UNSUBSCRIBED,
      });
    }

    await this.tagSubscriber({ subscriber, tag: this.tags.LOST });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_UNSUBSCRIBED,
      subscriber,
      user,
      additionalProperties: {
        unsubscribeReason: 'Webhook: Subscriber unsubscribed',
      },
    });
  }

  async handleReceivedEmail({ subscriber, properties }) {
    const user = UserService.getByEmail(subscriber?.email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    if (user?._id) {
      ActivityService.addServerActivity({
        title: 'Email Drip',
        type: ACTIVITY_TYPES.DRIP,
        userLink: { _id: user._id },
        metadata: {
          dripEmailId: properties?.email_id,
          dripEmailSubject: properties?.email_subject,
          dripStatus: 'received',
        },
      });
    }

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_RECEIVED_EMAIL,
      subscriber,
      user,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });
  }

  async handleOpenedEmail({ subscriber, properties }) {
    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_OPENED_EMAIL,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });
  }

  async handleClickedEmail({ subscriber, properties }) {
    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_CLICKED_EMAIL,
      subscriber,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
        dripEmailUrl: properties?.url,
      },
    });
  }

  async handleBounced({ subscriber, properties }) {
    const user = UserService.getByEmail(subscriber?.email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    if (user?._id) {
      setUserStatus.serverRun({
        userId: user?._id,
        status: USER_STATUS.LOST,
        source: 'drip',
        reason: 'Subscriber bounced',
        unsuccessfulReason: UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_UNREACHABLE,
      });

      ActivityService.addServerActivity({
        title: 'Email Drip - Rejet',
        type: ACTIVITY_TYPES.DRIP,
        userLink: { _id: user._id },
        metadata: {
          dripEmailId: properties?.email_id,
          dripEmailSubject: properties?.email_subject,
          dripStatus: 'bounced',
        },
      });
    }

    await this.tagSubscriber({ subscriber, tag: this.tags.LOST });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_BOUNCED,
      subscriber,
      user,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });
  }

  async handleComplained({ subscriber, properties }) {
    const user = UserService.getByEmail(subscriber?.email, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    if (user?._id) {
      setUserStatus.serverRun({
        userId: user?._id,
        status: USER_STATUS.LOST,
        source: 'drip',
        reason: 'Subscriber complained',
        unsuccessfulReason: UNSUCCESSFUL_LOAN_REASONS.DRIP_COMPLAINED,
      });
    }

    await this.tagSubscriber({ subscriber, tag: this.tags.LOST });

    await this.trackAnalyticsEvent({
      event: EVENTS.DRIP_SUBSCRIBER_COMPLAINED,
      subscriber,
      user,
      additionalProperties: {
        dripEmailId: properties?.email_id,
        dripEmailSubject: properties?.email_subject,
      },
    });
  }
}

export default new DripService({});
