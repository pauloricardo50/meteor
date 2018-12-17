import { Meteor } from 'meteor/meteor';
import { ROLES } from 'core/api/constants';
import { createDevs, createAdmins } from './userFixtures';
import { createYannisUser } from './demoFixtures';
import './promotionDemo/promotionFixturesMethods';
import { InterestRates } from '../api';
import { createFakeInterestRates } from './interestRatesFixtures';

Meteor.startup(() => {
  if (Meteor.users.find({ roles: { $in: [ROLES.DEV] } }).count() === 0) {
    createDevs();
    createAdmins();
  }

  if (Meteor.users.find({ 'emails.address': 'y@nnis.ch' }).count() === 0) {
    createYannisUser();
  }

  if (InterestRates.find({}).count() === 0) {
    createFakeInterestRates({ number: 10 });
  }
});
