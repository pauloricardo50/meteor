import NodeAnalytics from 'analytics-node';

class Analytics {
  constructor(key) {
    this.analytics = new NodeAnalytics(key);
    this.events = 
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
}

export default new Analytics('XqJuxPntb3fnO9FrU2vtshEuSdJ5FQ3d');
