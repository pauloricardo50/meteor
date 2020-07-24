// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

import { STEPS } from '../../api/loans/loanConstants';
import LoanService from '../../api/loans/server/LoanService';
import PromotionOptionService from '../../api/promotionOptions/server/PromotionOptionService';
import PromotionService from '../../api/promotions/server/PromotionService';
import UserService from '../../api/users/server/UserService';
import { ROLES } from '../../api/users/userConstants';
import { E2E_USER_EMAIL } from '../../fixtures/fixtureConstants';
import { createPromotionDemo } from '../../fixtures/promotionDemo/promotionDemoFixtures';
import {
  createEmailVerificationToken,
  createLoginToken,
  resetDatabase,
} from '../../utils/testHelpers';
import {
  ADMIN_EMAIL,
  PRO_EMAIL,
  PRO_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from './e2eConstants';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  checkConnection() {
    return 'stable';
  },
  setPassword({ userId, password }) {
    return Accounts.setPassword(userId, password);
  },
  async insertFullPromotion() {
    const admin = await UserService.get(
      { 'roles._id': ROLES.ADVISOR },
      { _id: 1 },
    );
    if (!admin) {
      const adminId = await Accounts.createUser({
        email: ADMIN_EMAIL,
        password: PRO_PASSWORD,
      });
      Roles.addUsersToRoles(adminId, ROLES.ADVISOR);
    }
    await createPromotionDemo(this.userId, false, false, 2);
  },
  setInvitedBy({ email }) {
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    const { _id: invitedBy } = UserService.getByEmail(email);
    const promotions = PromotionService.find(
      { 'userLinks._id': userId },
      { fields: { _id: 1 } },
    );

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
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    const promotions =
      PromotionService.find(
        { 'userLinks._id': userId },
        { fields: { _id: 1 } },
      ).fetch() || [];

    promotions.forEach(({ _id: promotionId }) =>
      PromotionService.setUserPermissions({ promotionId, userId, permissions }),
    );
  },
  setPromotionStatus({ status }) {
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    const promotions =
      PromotionService.find({
        'userLinks._id': userId,
      }) || [];

    promotions.forEach(({ _id: promotionId }) =>
      PromotionService.update({ promotionId, object: { status } }),
    );
  },
  getAppEndToEndTestData() {
    const { _id: userId } = UserService.getByEmail(E2E_USER_EMAIL);

    const admin =
      UserService.get({ 'roles._id': ROLES.ADVISOR }, { _id: 1 }) || {};

    const loan = LoanService.get(
      { userId, step: STEPS.REQUEST },
      { name: 1, properties: { _id: 1 } },
    );

    const adminLoginToken = createLoginToken(admin._id);
    const emailVerificationToken = createEmailVerificationToken(
      userId,
      E2E_USER_EMAIL,
    );

    const userId2 = UserService.createUser({
      options: { email: USER_EMAIL, password: USER_PASSWORD },
    });

    try {
      // Wrap due to meteor toys issue
      // https://github.com/MeteorToys/meteor-devtools/issues/111
      Accounts.sendResetPasswordEmail(userId2);
    } catch (error) {}

    const user = UserService.get(userId2, { services: 1 });

    const passwordResetToken = user.services.password.reset.token;

    return {
      loan,
      adminLoginToken,
      emailVerificationToken,
      userId,
      passwordResetToken,
      adminId: admin._id,
    };
  },
  inviteTestUser: async ({ withPassword, toPromotion } = {}) => {
    let userId;

    if (toPromotion) {
      const { _id: promotionId } = PromotionService.get({}, { _id: 1 });
      const { _id: proUserId } = UserService.getByEmail('broker1@e-potek.ch');
      const result = await UserService.proInviteUser({
        user: {
          email: USER_EMAIL,
          firstName: 'Test',
          lastName: 'User',
          phoneNumber: '0225660110',
        },
        promotionIds: [promotionId],
        proUserId,
      });
      userId = result.userId;
    } else {
      userId = UserService.adminCreateUser({
        email: USER_EMAIL,
        firstName: 'Test',
        lastName: 'User',
        sendEnrollmentEmail: true,
        phoneNumbers: ['0225660110'],
      });
      LoanService.fullLoanInsert({ userId });
    }

    if (withPassword) {
      Accounts.setPassword(userId, USER_PASSWORD);
    }

    return UserService.getLoginToken({ userId });
  },
  updateLoan({ loanId, object }) {
    LoanService.update({ loanId, object });
  },
  getLoginToken(email) {
    const user = email
      ? UserService.getByEmail(email)
      : UserService.get({}, { _id: 1 });
    const loginToken = UserService.getLoginToken({ userId: user._id });
    return loginToken;
  },
  serverLog: log => {
    check(log, String);
    if (Meteor.isServer) {
      console.log('Cypress logging from server: ', log);
    }
  },
  isLoggedIn() {
    return this.userId;
  },
  resetDatabase,
  getLoan(...params) {
    return LoanService.get(...params);
  },
  getUser(...params) {
    return UserService.get(...params);
  },
  startPromotionReservation() {
    const { _id: promotionOptionId } = PromotionOptionService.get(
      {},
      { _id: 1 },
    );
    PromotionOptionService.activateReservation({ promotionOptionId });
  },
});
