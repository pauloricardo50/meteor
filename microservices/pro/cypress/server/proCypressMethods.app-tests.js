// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import UserService from 'core/api/users/server/UserService';
import PromotionService from 'core/api/promotions/server/PromotionService';
import { ROLES, PROMOTION_TYPES } from 'core/api/constants';
import 'core/cypress/server/methods';
import { createPromotionDemo } from 'core/fixtures/promotionDemo/promotionDemoFixtures';
import OrganisationService from 'imports/core/api/organisations/server/OrganisationService';
import LoanService from 'imports/core/api/loans/server/LoanService';
import {
  PRO_EMAIL,
  PRO_EMAIL_2,
  PRO_EMAIL_3,
  PRO_PASSWORD,
  ORG_NAME,
} from '../proE2eConstants';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  generateProFixtures() {
    const userId = Accounts.createUser({
      email: PRO_EMAIL,
      password: PRO_PASSWORD,
    });
    UserService.update({ userId, object: { roles: [ROLES.PRO] } });
    const userId2 = Accounts.createUser({
      email: PRO_EMAIL_2,
      password: PRO_PASSWORD,
    });
    UserService.update({ userId: userId2, object: { roles: [ROLES.PRO] } });
    const userId3 = Accounts.createUser({
      email: PRO_EMAIL_3,
      password: PRO_PASSWORD,
    });
    UserService.update({ userId: userId3, object: { roles: [ROLES.PRO] } });
    OrganisationService.insert({
      name: ORG_NAME,
      type: 'DEVELOPER',
      address1: 'Rue du pré 1',
      zipCode: 1201,
      city: 'Genève',
      userLinks: [{ _id: userId }, { _id: userId2 }],
    });
    OrganisationService.insert({
      name: 'Organisation 2',
      type: 'DEVELOPER',
      address1: 'Rue du pré 1',
      zipCode: 1201,
      city: 'Genève',
      userLinks: [{ _id: userId3 }],
    });
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
  async insertFullPromotion() {
    await createPromotionDemo(this.userId, false, false, 10);
  },
  removeAllPromotions() {
    PromotionService.remove({ promotionId: {} });
  },
  addProUsersToPromotion() {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    const { _id: userId2 } = UserService.findOne({
      'emails.address': PRO_EMAIL_2,
    });
    const { _id: userId3 } = UserService.findOne({
      'emails.address': PRO_EMAIL_3,
    });
    const promotions = PromotionService.find({
      'userLinks._id': userId,
    }) || [];

    promotions.forEach(({ _id: promotionId }) => {
      PromotionService.addProUser({ promotionId, userId: userId2 });
      PromotionService.addProUser({ promotionId, userId: userId3 });
    });
  },
  setInvitedBy({ email }) {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    const { _id: invitedBy } = UserService.findOne({ 'emails.address': email });
    const promotions = PromotionService.find(
      { 'userLinks._id': userId },
      { fields: { _id: 1 } },
    ).fetch() || [];

    promotions.forEach(({ _id: promotionId }) => {
      const loans = LoanService.find({}).fetch() || [];
      loans.forEach(({ _id: loanId }) => {
        LoanService.updatePromotionInvitedBy({
          loanId,
          promotionId,
          invitedBy,
        });
      });
    });
  },
  setUserPermissions({ permissions }) {
    const { _id: userId } = UserService.findOne({
      'emails.address': PRO_EMAIL,
    });
    const promotions = PromotionService.find(
      { 'userLinks._id': userId },
      { fields: { _id: 1 } },
    ).fetch() || [];

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
  editOrganisation({ ...organisation }) {
    OrganisationService.baseUpdate({ name: ORG_NAME }, { $set: organisation });
  },
  updateAllLoans(loan) {
    LoanService.baseUpdate({}, { $set: loan });
  },
});
