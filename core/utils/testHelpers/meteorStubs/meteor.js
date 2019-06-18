import { Mongo } from './mongo';

export const Meteor = {
  userId: () => 'userId',
  users: { ...Mongo.Collection() },
  settings: { public: { subdomains: {} }, private: {} },
  methods: () => {},
};
