import { Meteor } from 'meteor/meteor';
import { createPromotionDemo } from './promotionDemoFixtures';

Meteor.methods({
  createDemoPromotion({ addCurrentUser, withPromotionOptions } = {}) {
    createPromotionDemo(this.userId, addCurrentUser, withPromotionOptions);
  },
});
