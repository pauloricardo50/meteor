import DefaultNodeAnalytics from 'analytics-node';
import { Meteor } from 'meteor/meteor';

import UserService from 'core/api/users/server/UserService';
import { Random } from 'meteor/random';
import { EVENTS_CONFIG } from './eventsConfig';
import { TRACKING_COOKIE } from '../analyticsConstants';
import MiddlewareManager from '../../../utils/MiddlewareManager';
import { impersonateMiddleware } from './analyticsHelpers';
import TestAnalytics from './TestAnalytics';

class NodeAnalytics extends DefaultNodeAnalytics {
  constructor(...args) {
    super(...args);
    this.middlewareManager = new MiddlewareManager(this);
  }

  initAnalytics(context) {
    ['identify', 'track', 'page', 'alias'].forEach((method) => {
      this.middlewareManager.applyToMethod(
        method,
        impersonateMiddleware(context),
      );
    });
  }
}

const { Segment = {} } = Meteor.settings.public.analyticsSettings;
const { key } = Segment;
const nodeAnalytics = new NodeAnalytics(key);
if (Meteor.isProduction && !key) {
  throw new Meteor.Error('No segment key found !');
}

class Analytics {
  constructor(context) {
    this.init(context);
  }

  init(context) {
    this.events = EVENTS_CONFIG;
    if (Meteor.isTest || Meteor.isAppTest) {
      this.analytics = new TestAnalytics();
    } else {
      this.analytics = nodeAnalytics;
    }

    this.context(context);
  }

  context(context) {
    const {
      userId,
      connection: {
        clientAddress,
        httpHeaders: {
          host,
          'user-agent': userAgent,
          'x-real-ip': realIp,
          referer: referrer,
        },
      },
    } = context;
    this.userId = userId;
    this.user = UserService.fetchOne({
      $filters: { _id: userId },
      firstName: 1,
      lastName: 1,
      email: 1,
      roles: 1,
    });
    this.clientAddress = realIp || clientAddress;
    this.host = this.formatHost(host);
    this.userAgent = userAgent;
    this.referrer = referrer;

    this.analytics.initAnalytics(context);
  }

  identify(trackingId) {
    this.alias(trackingId);

    this.analytics.identify({
      anonymousId: trackingId,
      userId: this.userId,
      traits: {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.roles[0],
      },
    });
  }

  track(event, data, trackingId) {
    if (!Object.keys(this.events).includes(event)) {
      throw new Meteor.Error(`Unknown event ${event}`);
    }
    const eventConfig = this.events[event];
    const { name, transform } = eventConfig;

    const eventProperties = transform ? transform(data) : {};

    this.analytics.track({
      ...(trackingId ? { anonymousId: trackingId } : {}),
      userId: this.userId,
      event: name,
      properties: eventProperties,
      context: {
        ip: this.clientAddress,
        userAgent: this.userAgent,
      },
    });
  }

  alias(trackingId) {
    if (trackingId) {
      this.analytics.alias({ userId: this.userId, previousId: trackingId });
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

  formatHost(host) {
    const isProduction = host.includes('production');
    const isStaging = host.includes('staging');

    let subdomain;

    ['www-', 'app-', 'admin-', 'pro-'].forEach((sub) => {
      if (host.includes(sub)) {
        subdomain = sub.split('-')[0];
      }
    });

    if (!subdomain || (!isProduction && !isStaging)) {
      return host;
    }

    return `${subdomain}${isStaging ? '.staging' : ''}.e-potek.ch`;
  }

  page(params) {
    const { cookies, sessionStorage, path, route, queryParams, queryString } = params;
    const trackingId = cookies[TRACKING_COOKIE];
    const formattedRoute = this.formatRouteName(route);

    this.analytics.page({
      name: formattedRoute,
      anonymousId: trackingId || Random.id(),
      ...(this.userId ? { userId: this.userId } : {}),
      context: {
        ip: this.clientAddress,
        userAgent: this.userAgent,
      },
      properties: {
        path,
        url: `${this.host}${path === '/' ? '' : path}`,
        referrer: this.referrer,
        ...queryParams,
        ...queryString,
      },
    });
  }
}

export default Analytics;
