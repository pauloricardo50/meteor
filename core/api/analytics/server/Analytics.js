import NodeAnalytics from 'analytics-node';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

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

    if (trackingId) {
      this.alias(userId, trackingId);
    }

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

    this.identify({ userId });
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

  page({ path, route, meteorUserId, trackingId, context, ...params }) {
    const formattedRoute = this.formatRoute(route);

    const properties = {
      path,
      url: `${this.baseUrl}${path}`,
      host: this.baseUrl,
      ...params,
    };

    this.analytics.page({
      name: formattedRoute,
      anonymousId: trackingId,
      userId: meteorUserId,
      context,
      properties,
    });

    // // Mixpanel does not use page, but event instead
    // this.analytics.track({
    //   event: `Viewed ${formattedRoute}`,
    //   anonymousId: trackingId,
    //   userId: meteorUserId,
    //   properties,
    //   integrations: { All: false, Mixpanel: true },
    // });
  }

  startPageTracking(subdomain) {
    this.baseUrl = Meteor.settings.public.subdomains[subdomain];
    WebApp.connectHandlers.use('/pagetrack', (req, res, next) => {
      const { cookies = {}, query = {}, headers = {} } = req;
      console.log('cookies:', cookies);
      const {
        'x-forwarded-for': ip,
        'user-agent': userAgent,
        referer,
      } = headers;
      const context = { ip, userAgent, referer };
      console.log('context:', context);

      const trackingId = cookies[TRACKING_COOKIE];
      console.log('trackingId:', trackingId);
      this.page({ ...query, context, trackingId });
      next();
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
