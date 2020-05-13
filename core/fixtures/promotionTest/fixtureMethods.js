import { Meteor } from 'meteor/meteor';

import { createTestPromotion as createPromotionTest } from './promotionTestFixtures';

Meteor.methods({
  createTestPromotion(...params) {
    return createPromotionTest(...params);
  },
});
