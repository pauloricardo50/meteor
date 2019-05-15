import NodeAnalytics from 'analytics-node';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import { EVENTS_CONFIG } from './events';
import { TRACKING_COOKIE } from './constants';

class Analytics {
  constructor() {
    const { Segment = {} } = Meteor.settings.public.analyticsSettings;
    const { key } = Segment;
    this.key = key;
    this.analytics = new NodeAnalytics(key);
    this.events = EVENTS_CONFIG;
  }

  identify(user) {
    const { _id: userId, firstName, lastName, emails, roles } = user;
    const email = emails[0].address;
    const role = roles[0];

    this.analytics.identify({
      userId,
      traits: {
        firstName,
        lastName,
        email,
        role,
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

    this.analytics.track({ userId, event: name, properties: eventProperties });
  }

  alias(newId, previousId) {
    this.analytics.alias({ userId: newId, previousId });
    this.analytics.flush();
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

  page({ path, route, meteorUserId, trackingId, ...params }) {
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
      properties,
      integrations: {
        All: true,
        Mixpanel: false,
      },
    });

    this.analytics.track({
      event: `Viewed ${formattedRoute}`,
      anonymousId: trackingId,
      userId: meteorUserId,
      properties,
      integrations: { All: false, Mixpanel: true },
    });
  }

  startPageTracking(subdomain) {
    this.baseUrl = Meteor.settings.public.subdomains[subdomain];
    WebApp.connectHandlers.use('/pagetrack', (req, res, next) => {
      const { cookies = {}, query = {} } = req;
      const trackingId = cookies[TRACKING_COOKIE];
      this.page({ ...query, trackingId });
      next();
    });
  }
}

export default new Analytics();
