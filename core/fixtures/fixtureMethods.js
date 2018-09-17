import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import range from 'lodash/range';
import {
  Borrowers,
  Loans,
  Offers,
  Properties,
  Tasks,
  Users,
  SecurityService,
} from '../api';
import TaskService from '../api/tasks/TaskService';
import { TASK_TYPE } from '../api/tasks/taskConstants';
import { AUCTION_STATUS } from '../api/loans/loanConstants';
import {
  USER_COUNT,
  UNOWNED_LOANS_COUNT,
  LOANS_PER_USER,
} from './fixtureConfig';
import { createFakeLoan } from './loanFixtures';
import { createFakeTask, deleteUsersTasks } from './taskFixtures';
import {
  createDevs,
  createAdmins,
  getFakeUsersIds,
  createUser,
  createFakeUsers,
} from './userFixtures';
import { createFakeOffer } from './offerFixtures';
import { ROLES } from '../api/users/userConstants';
import { E2E_USER_EMAIL } from './fixtureConstants';
import { createYannisData } from './demoFixtures';

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
  deleteUsersTasks(usersToDelete);
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
  createFakeTask(loanId, adminId);
  createFakeOffer(loanId, userId);
};

// Create a test user used in app's e2e tests and all the fixtures it needs
const createTestUserWithData = () => {
  const testUserId = createUser(E2E_USER_EMAIL, ROLES.USER);

  const admins = getAdmins();

  // Create step 3 loans with all types of auction statuses for the app's test user
  Object.keys(AUCTION_STATUS).forEach((statusKey) => {
    createFakeLoanFixture({
      step: 3,
      userId: testUserId,
      adminId: admins[0]._id,
      completeFiles: true,
      auctionStatus: AUCTION_STATUS[statusKey],
      twoBorrowers: true,
    });
  });
};

Meteor.methods({
  generateTestData(currentUserEmail) {
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      createDevs(currentUserEmail);
      const admins = getAdmins();
      const newUsers = createFakeUsers(USER_COUNT, ROLES.USER);

      // for each regular fixture user, create a loan with a certain step
      newUsers.forEach((userId, index) => {
        const adminId = admins[Math.floor(Math.random() * admins.length)];

        // based on index, always generate 1, 2 and 3 numbers
        const loanStep = (index % 3) + 1;

        range(LOANS_PER_USER).forEach(() => {
          createFakeLoanFixture({
            step: loanStep,
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
        Offers.rawCollection().remove({}),
        Loans.rawCollection().remove({}),
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
});
