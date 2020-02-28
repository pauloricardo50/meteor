import { Meteor } from 'meteor/meteor';

import { ROLES } from '../api/constants';
import InterestRatesService from '../api/interestRates/server/InterestRatesService';
import { createDevs, createAdmins } from './userFixtures';
import './promotionDemo/promotionFixturesMethods';
import { createFakeInterestRates } from './interestRatesFixtures';

Meteor.startup(() => {
  if (!Meteor.isAppTest) {
    if (Meteor.users.find({ 'roles._id': ROLES.DEV }).count() === 0) {
      createDevs();
      createAdmins();
    }
    if (InterestRatesService.countAll() === 0) {
      createFakeInterestRates({ number: 10 });
    }
  }
});
