import NodeAnalytics from 'analytics-node';
import { Meteor } from 'meteor/meteor';

import UserService from 'core/api/users/server/UserService';
import { EVENTS_CONFIG } from '../events';
import { TRACKING_COOKIE } from '../constants';

class Analytics {
  constructor() {
    const { Segment = {} } = Meteor.settings.public.analyticsSettings;
    const { key } = Segment;
    this.key = key;
    this.analytics = new NodeAnalytics(key);
    this.events = EVENTS_CONFIG;
  }

  identify({ userId, trackingId }) {
    const { firstName, lastName, email, roles } = UserService.fetchOne({
      $filters: { _id: userId },
      firstName: 1,
      lastName: 1,
      email: 1,
      roles: 1,
    });

    this.alias(userId, trackingId);

    this.analytics.identify({
      anonymousId: trackingId,
      userId,
      traits: {
        firstName,
        lastName,
        email,
        role: roles[0],
      },
    });
  }

  // All tracked events shall be called with a logged in user
  track({ userId, event, data }) {
    if (!Object.keys(this.events).includes(event)) {
      throw new Meteor.Error(`Unknown event ${event}`);
    }
    const eventConfig = this.events[event];
    const { name, properties = [] } = eventConfig;

    const eventProperties = properties.reduce(
      (obj, property) => ({ ...obj, [property]: data[property] }),
      {},
    );

    this.analytics.track({
      userId,
      event: name,
      properties: { ...eventProperties },
      context: {
        userAgent: 'test',
      },
    });
  }

  alias(newId, previousId) {
    this.analytics.alias({ userId: newId, previousId });
  }

  // Returns the route string in a more readable format
  // ex: APP_LOGIN_PAGE => App login page
  formatRoute(route) {
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

  page({ context, params }) {
    const {
      userId,
      connection: {
        clientAddress,
        httpHeaders: { host, 'user-agent': userAgent },
      },
    } = context;
    const { cookies, sessionStorage, path, route, queryParams } = params;
    const trackingId = cookies[TRACKING_COOKIE];
    const formattedRoute = this.formatRoute(route);

    this.analytics.page({
      name: formattedRoute,
      anonymousId: trackingId,
      ...(userId ? { userId } : {}),
      context: {
        ip: clientAddress,
        userAgent,
      },
      properties: {
        path,
        url: `${host}${path}`,
        ...queryParams,
      },
    });
  }
}

let analytics;

if (Meteor.isTest) {
  analytics = '';
} else {
  analytics = new Analytics();
}

export default analytics;
