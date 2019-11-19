import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import DefaultNodeAnalytics from 'analytics-node';

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
    if (Meteor.isTest || Meteor.isAppTest || Meteor.isDevelopment) {
      this.analytics = new TestAnalytics();
    } else {
      this.analytics = new NodeAnalytics(key);
    }

    this.context(context);
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
    this.user = UserService.fetchOne({
      $filters: { _id: userId },
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
    const { firstName, lastName, email, roles } = UserService.fetchOne({
      $filters: { _id: userId },
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
    const { name, transform } = eventConfig;

    const eventProperties = transform ? transform(data) : data;

    return {
      name,
      properties: {
        ...eventProperties,
        trackingOrigin: this.getTrackingOrigin(),
      },
    };
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

export default Analytics;
