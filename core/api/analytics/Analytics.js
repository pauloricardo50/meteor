import NodeAnalytics from 'analytics-node';
import { Meteor } from 'meteor/meteor';
import { EVENTS_CONFIG } from './events';

class Analytics {
  constructor(key) {
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
}

export default new Analytics('XqJuxPntb3fnO9FrU2vtshEuSdJ5FQ3d');
