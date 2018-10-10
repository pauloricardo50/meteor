import { Meteor } from 'meteor/meteor';
import { createPromotionDemo } from './promotionDemoFixtures';

Meteor.methods({
  createDemoPromotion() {
    createPromotionDemo(this.userId);
  },
});
