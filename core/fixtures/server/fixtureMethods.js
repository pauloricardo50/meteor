import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import range from 'lodash/range';
import { STEPS, STEP_ORDER, ROLES, TASK_TYPE } from 'core/api/constants';
import {
  Borrowers,
  Loans,
  Lots,
  Offers,
  Organisations,
  PromotionLots,
  PromotionOptions,
  Promotions,
  Properties,
  SecurityService,
  Tasks,
  Users,
} from '../../api';
import TaskService from '../../api/tasks/TaskService';
import {
  USER_COUNT,
  UNOWNED_LOANS_COUNT,
  LOANS_PER_USER,
} from '../fixtureConfig';
import { createFakeLoan } from '../loanFixtures';
import {
  createDevs,
  createAdmins,
  getFakeUsersIds,
  createUser,
  createFakeUsers,
} from '../userFixtures';
import { createFakeOffer } from '../offerFixtures';
import { E2E_USER_EMAIL } from '../fixtureConstants';
import { createYannisData } from '../demoFixtures';
import { createOrganisations } from '../organisationFixtures';
import { createFakeInterestRates } from '../interestRatesFixtures';

const isAuthorizedToRun = () => !Meteor.isProduction || Meteor.isStaging;

const getAdmins = () => {
  const admins = Users.find({ roles: { $in: [ROLES.ADMIN] } }).fetch();
  if (admins.length <= 1) {
    const newAdmins = createAdmins();
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

const deleteUsersRelatedData = (usersToDelete) => {
  Borrowers.remove({ userId: { $in: usersToDelete } });
  Properties.remove({ userId: { $in: usersToDelete } });
  Offers.remove({ userId: { $in: usersToDelete } });
  Loans.remove({ userId: { $in: usersToDelete } });
};

const deleteUsers = usersToDelete =>
  Users.remove({ _id: { $in: usersToDelete } });

const createFakeLoanFixture = ({
  userId,
  step,
  adminId,
  completeFiles,
  auctionStatus,
  twoBorrowers,
}) => {
  const loanId = createFakeLoan({
    userId,
    step,
    completeFiles,
    auctionStatus,
    twoBorrowers,
  });
  createFakeOffer(loanId, userId);
};

// Create a test user used in app's e2e tests and all the fixtures it needs
const createTestUserWithData = () => {
  const testUserId = createUser(E2E_USER_EMAIL, ROLES.USER);
  const admins = getAdmins();

  // Create 2 loans to check AppPage, which requires multiple loans to display
  createFakeLoanFixture({
    step: STEPS.PREPARATION,
    userId: testUserId,
    adminId: admins[0]._id,
    completeFiles: true,
    twoBorrowers: true,
  });
  createFakeLoanFixture({
    step: STEPS.PREPARATION,
    userId: testUserId,
    adminId: admins[0]._id,
    completeFiles: true,
    twoBorrowers: true,
  });
};

Meteor.methods({
  generateTestData(currentUserEmail) {
    if (isAuthorizedToRun()) {
      debugger;
      const devs = createDevs(currentUserEmail);
      const admins = getAdmins();
      const newUsers = createFakeUsers(USER_COUNT, ROLES.USER);
      createOrganisations();

      // for each regular fixture user, create a loan with a certain step
      newUsers.forEach((userId, index) => {
        const adminId = admins[Math.floor(Math.random() * admins.length)];

        // based on index, always generate 0, 1 and 2 numbers
        const loanStep = index % 3;

        range(LOANS_PER_USER).forEach(() => {
          createFakeLoanFixture({
            step: STEP_ORDER[loanStep],
            userId,
            adminId,
            twoBorrowers: true,
          });
        });
      });

      range(UNOWNED_LOANS_COUNT).forEach(() => {
        createFakeLoan({});
      });

      createTestUserWithData();
    }
  },

  async purgeDatabase(currentUserId) {
    check(currentUserId, String);
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      await Promise.all([
        Borrowers.rawCollection().remove({}),
        Loans.rawCollection().remove({}),
        Lots.remove({}),
        Offers.rawCollection().remove({}),
        Organisations.rawCollection().remove({}),
        PromotionLots.rawCollection().remove({}),
        PromotionOptions.rawCollection().remove({}),
        Promotions.rawCollection().remove({}),
        Properties.rawCollection().remove({}),
        Tasks.rawCollection().remove({}),
        Users.rawCollection().remove({ _id: { $ne: currentUserId } }),
      ]);
    }
  },

  purgeFakeData(currentUserId) {
    check(currentUserId, String);
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      let fakeUsersIds = getFakeUsersIds();
      deleteUsersRelatedData(fakeUsersIds);

      fakeUsersIds = fakeUsersIds.filter(item => item !== currentUserId);
      deleteUsers(fakeUsersIds);
    }
  },

  purgePersonalData(currentUserId) {
    deleteUsersRelatedData([currentUserId]);
  },

  insertBorrowerRelatedTask() {
    const borrower = Borrowers.aggregate({ $sample: { size: 1 } })[0];
    const type = TASK_TYPE.VERIFY;
    if (borrower._id) {
      TaskService.insert({ type, borrowerId: borrower._id });
    }
  },

  insertLoanRelatedTask() {
    const loanId = Loans.aggregate({ $sample: { size: 1 } })[0]._id;
    const type = TASK_TYPE.VERIFY;
    if (loanId) {
      TaskService.insert({ type, loanId });
    }
  },

  insertPropertyRelatedTask() {
    const propertyId = Properties.aggregate({ $sample: { size: 1 } })[0]._id;
    const type = TASK_TYPE.CUSTOM;
    if (propertyId) {
      TaskService.insert({ type, propertyId });
    }
  },

  resetYannisAccount({ userId }) {
    SecurityService.currentUserHasRole(ROLES.DEV);
    Loans.remove({ userId });
    Borrowers.remove({ userId });
    Properties.remove({ userId });
    createYannisData(userId);
  },

  createFakeOffer({ loanId, userId }) {
    createFakeOffer(loanId, userId);
  },

  createFakeInterestRates({ number }) {
    createFakeInterestRates({ number });
  },
});
