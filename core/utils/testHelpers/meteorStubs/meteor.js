import { Mongo } from './mongo';

export const Meteor = {
  userId: () => 'userId',
  users: { ...Mongo.Collection() },
  settings: {
    public: { subdomains: {}, analyticsSettings: {} },
    private: {},
    exoscale: {},
    storage: {},
  },
  methods: () => {},
  startup: () => {},
  Error: class {},
};
