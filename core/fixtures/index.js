import './promotionDemo/promotionFixturesMethods';

import { Meteor } from 'meteor/meteor';

import InterestRatesService from '../api/interestRates/server/InterestRatesService';
import { ROLES } from '../api/users/userConstants';
import { createFakeInterestRates } from './interestRatesFixtures';
import { createAdmins, createDevs } from './userFixtures';

Meteor.startup(() => {
  if (!Meteor.isAppTest) {
    if (Meteor.users.find({ roles: { $in: [ROLES.DEV] } }).count() === 0) {
      createDevs();
      createAdmins();
    }
    if (InterestRatesService.countAll() === 0) {
      createFakeInterestRates({ number: 10 });
    }
  }
});
