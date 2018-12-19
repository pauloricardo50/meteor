// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import UserService from 'core/api/users/UserService';
import PromotionService from 'core/api/promotions/PromotionService';
import { ROLES, PROMOTION_TYPES } from 'core/api/constants';
import 'core/cypress/server/methods';
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
        address1: 'Chemin Auguste-Vilbert 14',
        zipCode: '1218',
        city: 'Le Grand-Saconnex',
      },
    });
  },
});
