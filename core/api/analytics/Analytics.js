import NodeAnalytics from 'analytics-node';
import { Meteor } from 'meteor/meteor';
import { EVENTS_CONFIG } from './events';
import initClient from './initClient';

class Analytics {
  constructor() {
    const { Segment = {} } = Meteor.settings.public.analyticsSettings;
    const { key } = Segment;
    this.key = key;
    this.analytics = new NodeAnalytics(key);
    this.events = EVENTS_CONFIG;
  }

  initializeClient() {
    initClient(this.key);
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
}

export default new Analytics();
