// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import UserService from 'core/api/users/server/UserService';
import PromotionService from 'core/api/promotions/server/PromotionService';
import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';
import {
  ROLES,
  PROMOTION_TYPES,
  LOAN_QUERIES,
  STEPS,
  ORGANISATION_FEATURES,
} from 'core/api/constants';
import { createPromotionDemo } from 'core/fixtures/promotionDemo/promotionDemoFixtures';
import OrganisationService from 'core/api/organisations/server/OrganisationService';
import LoanService from 'core/api/loans/server/LoanService';
import PropertyService from 'core/api/properties/server/PropertyService';
import Loans from 'core/api/loans/loans';
import { loanBase, adminLoan } from 'core/api/fragments';
import {
  createLoginToken,
  createEmailVerificationToken,
} from 'core/utils/testHelpers/index';
import { createFakeInterestRates } from 'core/fixtures/interestRatesFixtures';
import { adminLoans as adminLoansQuery } from 'core/api/loans/queries';
import { Services } from 'core/api/server/index';
import LenderRulesService from 'core/api/lenderRules/server/LenderRulesService';
import { createAdmins, createEpotek } from 'core/fixtures/userFixtures';
import { E2E_USER_EMAIL } from '../../fixtures/fixtureConstants';
import {
  PRO_EMAIL,
  PRO_EMAIL_2,
  PRO_EMAIL_3,
  PRO_PASSWORD,
  ORG_NAME,
  USER_EMAIL,
  USER_PASSWORD,
  ADMIN_EMAIL,
} from './e2eConstants';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

const userLoansE2E = Loans.createQuery(LOAN_QUERIES.USER_LOANS_E2E, {
  $filter({ filters, params: { userId, unowned, step } }) {
    filters.userId = userId;

    if (unowned) {
      filters.userId = { $exists: false };
    }

    if (step) {
      filters.step = step;
    }
  },
  ...loanBase(),
  $options: { sort: { createdAt: -1 } },
});

Meteor.methods({
  createAdmins() {
    createAdmins();
  },
  generateProFixtures() {
    const userId = Accounts.createUser({
      email: PRO_EMAIL,
      password: PRO_PASSWORD,
    });
    Roles.addUsersToRoles(userId, ROLES.PRO);
    const userId2 = Accounts.createUser({
      email: PRO_EMAIL_2,
      password: PRO_PASSWORD,
    });
    Roles.addUsersToRoles(userId2, ROLES.PRO);
    const userId3 = Accounts.createUser({
      email: PRO_EMAIL_3,
      password: PRO_PASSWORD,
    });
    Roles.addUsersToRoles(userId3, ROLES.PRO);

    const orgId = createEpotek();
    const adminId = Accounts.createUser({
      email: ADMIN_EMAIL,
      password: PRO_PASSWORD,
    });
    Roles.addUsersToRoles(adminId, ROLES.ADMIN);

    UserService.updateOrganisations({
      userId: adminId,
      newOrganisations: [{ _id: orgId, metadata: { isMain: true } }],
    });

    const orgId1 = OrganisationService.insert({
      name: ORG_NAME,
      type: 'DEVELOPER',
      address1: 'Rue du pré 1',
      zipCode: 1201,
      city: 'Genève',
      features: [ORGANISATION_FEATURES.PRO],
    });

    const orgId2 = OrganisationService.insert({
      name: 'Organisation 2',
      type: 'DEVELOPER',
      address1: 'Rue du pré 1',
      zipCode: 1201,
      city: 'Genève',
      userLinks: [{ _id: userId3, metadata: { isMain: true } }],
      features: [ORGANISATION_FEATURES.PRO],
    });

    UserService.updateOrganisations({
      userId,
      newOrganisations: [{ _id: orgId1, metadata: { isMain: true } }],
    });
    UserService.updateOrganisations({
      userId: userId2,
      newOrganisations: [{ _id: orgId1, metadata: { isMain: true } }],
    });
    UserService.updateOrganisations({
      userId: userId3,
      newOrganisations: [{ _id: orgId2, metadata: { isMain: true } }],
    });

    const organisationId = OrganisationService.insert({
      name: 'Bank 1',
      type: 'BANK',
      address1: 'Rue du pré 1',
      zipCode: 1201,
      city: 'Genève',
      features: [ORGANISATION_FEATURES.LENDER],
    });
    LenderRulesService.initialize({ organisationId });
  },
  insertPromotion() {
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    PromotionService.insert({
      userId,
      promotion: {
        name: 'Test promotion',
        type: PROMOTION_TYPES.CREDIT,
        address1: 'Rue du four 1',
        zipCode: '1400',
        city: 'Yverdon-les-Bains',
        agreementDuration: 14,
      },
    });
  },
  async insertFullPromotion() {
    const admin = await UserService.get(
      { 'roles._id': ROLES.ADMIN },
      { _id: 1 },
    );
    if (!admin) {
      const adminId = await Accounts.createUser({
        email: ADMIN_EMAIL,
        password: PRO_PASSWORD,
      });
      Roles.addUsersToRoles(adminId, ROLES.ADMIN);
    }
    await createPromotionDemo(this.userId, false, false, 4);
  },
  removeAllPromotions() {
    PromotionService.remove({ promotionId: {} });
  },
  addProUsersToPromotion() {
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    const { _id: userId2 } = UserService.getByEmail(PRO_EMAIL_2);
    const { _id: userId3 } = UserService.getByEmail(PRO_EMAIL_3);
    const promotions =
      PromotionService.find({
        'userLinks._id': userId,
      }) || [];

    promotions.forEach(({ _id: promotionId }) => {
      PromotionService.addProUser({ promotionId, userId: userId2 });
      PromotionService.addProUser({ promotionId, userId: userId3 });
    });
  },
  setInvitedBy({ email }) {
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    const { _id: invitedBy } = UserService.getByEmail(email);
    const promotions =
      PromotionService.find(
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
  resetUserPermissions() {
    const { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    const promotions =
      PromotionService.find({
        'userLinks._id': userId,
      }).fetch() || [];

    const permissions = {
      canModifyLots: false,
      canRemoveLots: false,
      canModifyPromotion: false,
      canManageDocuments: false,
      canReserveLots: false,
      canInviteCustomers: false,
      canAddLots: false,
      displayCustomerNames: false,
    };

    promotions.forEach(({ _id: promotionId }) =>
      PromotionService.setUserPermissions({ promotionId, userId, permissions }),
    );
  },
  editOrganisation({ ...organisation }) {
    OrganisationService.baseUpdate({ name: ORG_NAME }, { $set: organisation });
  },
  updateAllLoans(loan) {
    LoanService.baseUpdate({}, { $set: loan });
  },

  getAppEndToEndTestData() {
    const { _id: userId } = UserService.getByEmail(E2E_USER_EMAIL);
    // console.log('testUser:', testUser);

    // if (!testUser) {
    //   const testUserId = createUser(E2E_USER_EMAIL, ROLES.USER);
    //   testUser = { _id: testUserId };
    // }
    // const { _id: userId } = testUser || {};

    // const adminId = Accounts.createUser({
    //   email: ADMIN_EMAIL,
    //   password: PRO_PASSWORD,
    // });
    // UserService.update({ userId: adminId, object: { roles: [ROLES.ADMIN] } });

    const admin =
      UserService.get({ 'roles._id': ROLES.ADMIN }, { _id: 1 }) || {};

    const solvencyLoan = userLoansE2E
      .clone({ userId, step: STEPS.SOLVENCY })
      .fetchOne();

    const requestLoan = userLoansE2E
      .clone({ userId, step: STEPS.REQUEST })
      .fetchOne();

    const unownedLoan = userLoansE2E.clone({ owned: false }).fetchOne();

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
      solvencyLoan,
      requestLoan,
      unownedLoan,
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
        options: {
          email: USER_EMAIL,
          firstName: 'Test',
          lastName: 'User',
          sendEnrollmentEmail: true,
          phoneNumber: '0225660110',
        },
      });
      LoanService.fullLoanInsert({ userId });
    }

    if (withPassword) {
      Accounts.setPassword(userId, USER_PASSWORD);
    }

    const loginToken = UserService.getLoginToken({ userId });
    return loginToken;
  },
  removeTestUser(email) {
    const user = UserService.getByEmail(email);
    if (user) {
      UserService.remove({ userId: user._id });
    }
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
  addProProperty() {
    let { _id: userId } = UserService.getByEmail(PRO_EMAIL);
    if (!userId) {
      userId = UserService.adminCreateUser({
        options: {
          email: PRO_EMAIL,
          firstName: 'Pro',
          lastName: 'Test User',
        },
        role: ROLES.PRO,
      });
    }
    const propertyId = PropertyService.proPropertyInsert({
      property: {
        address1: 'Chemin Auguste-Vilbert 14',
        zipCode: 1218,
        city: 'Le Grand-Saconnex',
        value: 1500000,
      },
      userId,
    });

    return propertyId;
  },
  addUserProperty() {
    return PropertyService.insert({
      property: {
        address1: 'Chemin Auguste-Vilbert 14',
        zipCode: 1218,
        city: 'Le Grand-Saconnex',
        value: 1500000,
      },
    });
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
  generateFixtures() {
    createFakeInterestRates({ number: 10 });
  },
  addProUser() {
    const { _id } = UserService.getByEmail(PRO_EMAIL) || {};

    const userId =
      _id ||
      UserService.adminCreateUser({
        options: {
          email: PRO_EMAIL,
          firstName: 'Pro',
          lastName: 'Test User',
        },
        role: ROLES.PRO,
      });

    return userId;
  },
  getLoan(loanId) {
    return LoanService.get(loanId, {
      ...adminLoan(),
      referralId: 1,
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
    });
  },
  getUser(email) {
    return UserService.getByEmail(email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
    });
  },
  getAdminEndToEndTestData() {
    const loan = adminLoansQuery.clone({ owned: true }).fetchOne();

    const {
      properties,
      borrowers: [borrower],
    } = loan;

    const user = UserService.get(loan.userId, { _id: 1 });

    return { loan, user, property: properties[0], borrower };
  },
  addOrganisation() {
    return OrganisationService.insert({
      name: 'Org',
      type: 'DEVELOPER',
      address1: 'Rue du pré 1',
      zipCode: 1201,
      city: 'Genève',
      features: [ORGANISATION_FEATURES.PRO],
    });
  },
  updateCollectionDocument({ docId, collection, object, operator }) {
    const service = Services[collection];
    return service._update({ id: docId, object, operator });
  },
  startPromotionReservation() {
    const { _id: promotionOptionId } = PromotionOptionService.get(
      {},
      { _id: 1 },
    );
    PromotionOptionService.activateReservation({ promotionOptionId });
  },
});
