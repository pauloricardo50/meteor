import { Meteor } from 'meteor/meteor';
import { createPromotionDemo } from './promotionDemoFixtures';

Meteor.methods({
  createDemoPromotion({ addCurrentUser, withPromotionOptions, users } = {}) {
    createPromotionDemo(
      this.userId,
      addCurrentUser,
      withPromotionOptions,
      Number.parseInt(users, 10),
    );
  },
});
