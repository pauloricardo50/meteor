import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import DefaultNodeAnalytics from 'analytics-node';
import curryRight from 'lodash/curryRight';

import SlackService from 'core/api/slack/server/SlackService';
import { getClientHost } from '../../../utils/server/getClientUrl';
import { getClientTrackingId } from '../../../utils/server/getClientTrackingId';
import UserService from '../../users/server/UserService';
import { isAPI } from '../../RESTAPI/server/helpers';
import SessionService from '../../sessions/server/SessionService';
import MiddlewareManager from '../../../utils/MiddlewareManager';
import { TRACKING_COOKIE } from '../analyticsConstants';
import EVENTS from '../events';
import { EVENTS_CONFIG, TRACKING_ORIGIN } from './eventsConfig';
import { impersonateMiddleware } from './analyticsHelpers';
import TestAnalytics from './TestAnalytics';

const curryPick = curryRight((obj, keys) =>
  keys.reduce((o, k) => ({ ...o, [k]: obj[k] }), {}),
);

class NodeAnalytics extends DefaultNodeAnalytics {
  constructor(...args) {
    super(...args);
    this.middlewareManager = new MiddlewareManager(this);
  }

  initAnalytics(context) {
    ['identify', 'track', 'page', 'alias'].forEach(method => {
      this.middlewareManager.applyToMethod(
        method,
        impersonateMiddleware(context),
      );
    });
  }
}

const { Segment = {} } = Meteor.settings.public.analyticsSettings;
const { key } = Segment;
if (Meteor.isProduction && !key) {
  throw new Meteor.Error('No segment key found !');
}

class Analytics {
  constructor(context = {}) {
    this.init(context);
  }

  init(context) {
    this.events = EVENTS_CONFIG;
    this.checkEventsConfig();
    if (Meteor.isTest || Meteor.isAppTest || Meteor.isDevelopment) {
      this.analytics = new TestAnalytics();
    } else {
      this.analytics = new NodeAnalytics(key);
    }

    this.context(context);
  }

  checkEventsConfig() {
    Object.keys(this.events).forEach(event => {
      const { name, properties = [] } = this.events[event];

      if (!name) {
        throw new Meteor.Error(`No name for event ${event}`);
      }

      if (properties.length) {
        properties.forEach(property => {
          if (!property) {
            throw new Meteor.Error(
              `Falsy property ${property} for event ${event}`,
            );
          }

          if (typeof property === 'object' && !property.name) {
            throw new Meteor.Error(
              `No property name in ${JSON.stringify(
                property,
                null,
                2,
              )} for event ${event}`,
            );
          }
        });
      }
    });
  }

  context(context) {
    const { userId } = context;
    const connection = context.connection || {};
    const {
      id: connectionId,
      clientAddress,
      httpHeaders: {
        'user-agent': userAgent,
        'x-real-ip': realIp,
        referer: referrer,
      } = {},
    } = connection;
    this.userId = userId;
    this.user = UserService.get(userId, {
      firstName: 1,
      lastName: 1,
      email: 1,
      roles: 1,
    });
    this.clientAddress = realIp || clientAddress;
    this.host = getClientHost();
    this.userAgent = userAgent;
    this.referrer = referrer;
    this.connectionId = connectionId;

    this.analytics.initAnalytics({
      ...context,
      clientAddress: this.clientAddress,
      host: this.host,
    });
  }

  createAnalyticsUser(userId, data) {
    const { firstName, lastName, email, roles } = UserService.get(userId, {
      firstName: 1,
      lastName: 1,
      email: 1,
      roles: 1,
    });

    this.analytics.identify({
      userId,
      traits: {
        firstName,
        lastName,
        email,
        role: roles[0],
      },
    });

    const { name, properties } = this.getEventProperties(
      EVENTS.USER_CREATED,
      data,
    );

    this.analytics.track({
      userId,
      event: name,
      properties,
    });
  }

  identify(trackingId) {
    this.alias(trackingId);

    this.analytics.identify({
      userId: this.userId,
      traits: {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.roles[0],
      },
    });
  }

  getTrackingOrigin() {
    return isAPI() ? TRACKING_ORIGIN.API : TRACKING_ORIGIN.METEOR_METHOD;
  }

  getEventProperties(event, data) {
    const eventConfig = this.events[event];
    const { name, properties } = eventConfig;

    const eventProperties = properties
      ? this.checkEventProperties(event, data)
      : data;

    return {
      name,
      properties: {
        ...eventProperties,
        trackingOrigin: this.getTrackingOrigin(),
      },
    };
  }

  checkEventProperties(event, data) {
    const eventConfig = this.events[event];
    const { name: eventName, properties = [] } = eventConfig;

    const propertyNames = properties.map(property => property.name || property);
    const pickedProperties = curryPick(propertyNames)(data);

    properties.forEach(property => {
      const name = property.name || property;
      let optional = false;
      if (typeof property === 'object') {
        optional =
          typeof property.optional === 'function'
            ? property.optional(data)
            : property.optional;
      }

      if (!optional && pickedProperties[name] === undefined) {
        const error = new Meteor.Error(
          `Property ${name} in event ${eventName} is required !`,
        );
        SlackService.sendError({
          error,
          additionalData: [{ event, data, pickedProperties }],
        });

        if (!Meteor.isProduction || Meteor.isStaging) {
          // Make sure we are alerted in test or dev if a analytics event is
          // misconfigured
          throw error;
        }
      }
    });

    return pickedProperties;
  }

  track(event, data, trackingId = getClientTrackingId()) {
    if (!Object.keys(this.events).includes(event)) {
      throw new Meteor.Error(`Unknown event ${event}`);
    }

    const { name, properties } = this.getEventProperties(event, data);

    this.analytics.track({
      ...(trackingId ? { anonymousId: trackingId } : {}),
      userId: this.userId,
      event: name,
      properties,
      context: {
        ip: this.clientAddress,
        userAgent: this.userAgent,
      },
    });
  }

  alias(trackingId) {
    if (trackingId) {
      this.analytics.alias({ userId: this.userId, previousId: trackingId });
      this.analytics.flush();
    }
  }

  // Returns the route string in a more readable format
  // ex: APP_LOGIN_PAGE => App login page
  formatRouteName(route) {
    return route
      .toLowerCase()
      .split('_')
      .map((w, i) => {
        if (i === 0) {
          return w.slice(0, 1).toUpperCase() + w.slice(1);
        }

        return w;
      })
      .join(' ');
  }

  cta(params) {
    const { cookies, route, path } = params;

    const trackingId = this.userId ? undefined : cookies[TRACKING_COOKIE];
    const formattedRoute = this.formatRouteName(route);

    this.track(
      EVENTS.CTA_CLICKED,
      {
        ...params,
        route: formattedRoute,
        url: `${this.host}${path === '/' ? '' : path}`,
        referrer: this.referrer,
      },
      trackingId,
    );
  }

  page(params) {
    const { cookies, path, route, queryParams, queryString } = params;
    const trackingId = cookies[TRACKING_COOKIE];
    const formattedRoute = this.formatRouteName(route);

    this.analytics.page({
      name: formattedRoute,
      ...(this.userId
        ? { userId: this.userId }
        : { anonymousId: trackingId || Random.id() }),
      context: {
        ip: this.clientAddress,
        userAgent: this.userAgent,
      },
      properties: {
        path,
        url: `${this.host}${path === '/' ? '' : path}`,
        referrer: this.referrer,
        ...queryString,
        ...queryParams,
      },
    });

    SessionService.setLastActivity({
      connectionId: this.connectionId,
      lastPageVisited: path,
    });
  }
}

export const checkEventsConfig = (events = EVENTS_CONFIG) => {
  Object.keys(events).forEach(event => {
    const { name, properties = [] } = events[event];

    if (!name) {
      throw new Meteor.Error(`No name for event ${event}`);
    }

    if (properties.length) {
      properties.forEach(property => {
        if (!property) {
          throw new Meteor.Error(
            `Falsy property ${property} for event ${event}`,
          );
        }

        if (typeof property === 'object' && !property.name) {
          throw new Meteor.Error(
            `No property name in ${JSON.stringify(
              property,
              null,
              2,
            )} for event ${event}`,
          );
        }
      });
    }
  });
};

Meteor.startup(() => checkEventsConfig(EVENTS_CONFIG));

export default Analytics;
