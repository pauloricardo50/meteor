// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import UserService from 'core/api/users/server/UserService';
import PromotionService from 'core/api/promotions/server/PromotionService';
import { ROLES, PROMOTION_TYPES } from 'core/api/constants';
import 'core/cypress/server/methods';
import { createPromotionDemo } from 'core/fixtures/promotionDemo/promotionDemoFixtures';
import { PRO_EMAIL, PRO_PASSWORD } from '../constants';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  generateProFixtures() {
    const userId = Accounts.createUser({
      email: PRO_EMAIL,
      password: PRO_PASSWORD,
    });
    UserService.update({ userId, object: { roles: [ROLES.PRO] } });
  },
  insertPromotion() {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    PromotionService.insert({
      userId,
      promotion: {
        name: 'Test promotion',
        type: PROMOTION_TYPES.CREDIT,
        address1: 'Rue du four 1',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
      },
    });
  },
  insertFullPromotion() {
    createPromotionDemo(this.userId, false, false, 10, true);
  },
  setUserPermissions({ permissions }) {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    const promotions = PromotionService.find({
      'userLinks._id': userId,
    }) || [];

    promotions.forEach(({ _id: promotionId }) =>
      PromotionService.setUserPermissions({ promotionId, userId, permissions }));
  },
  setPromotionStatus({ status }) {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    const promotions = PromotionService.find({
      'userLinks._id': userId,
    }) || [];

    promotions.forEach(({ _id: promotionId }) =>
      PromotionService.update({ promotionId, object: { status } }));
  },
  resetUserPermissions() {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    const promotions = PromotionService.find({
      'userLinks._id': userId,
    }).fetch() || [];

    const permissions = {
      canSellLots: false,
      canModifyLots: false,
      canRemoveLots: false,
      canModifyPromotion: false,
      canManageDocuments: false,
      canBookLots: false,
      canInviteCustomers: false,
      canAddLots: false,
      displayCustomerNames: false,
    };

    promotions.forEach(({ _id: promotionId }) =>
      PromotionService.setUserPermissions({ promotionId, userId, permissions }));
  },
});
