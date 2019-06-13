import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import range from 'lodash/range';

import {
  STEPS,
  STEP_ORDER,
  ROLES,
  TASK_TYPE,
  PURCHASE_TYPE,
  APPLICATION_TYPES,
  ORGANISATION_TYPES,
} from '../../api/constants';
import {
  Borrowers,
  Contacts,
  Loans,
  Lots,
  Offers,
  Organisations,
  PromotionLots,
  PromotionOptions,
  Promotions,
  Properties,
  Tasks,
  Users,
} from '../../api';
import SecurityService from '../../api/security';
import TaskService from '../../api/tasks/server/TaskService';
import {
  USER_COUNT,
  UNOWNED_LOANS_COUNT,
  LOANS_PER_USER,
} from '../fixtureConfig';
import { createFakeLoan, addLoanWithData } from '../loanFixtures';
import {
  createDevs,
  createAdmins,
  getFakeUsersIds,
  createUser,
  createFakeUsers,
} from '../userFixtures';
import { createFakeOffer } from '../offerFixtures';
import { E2E_USER_EMAIL } from '../fixtureConstants';
import { createOrganisations } from '../organisationFixtures';
import { createFakeInterestRates } from '../interestRatesFixtures';
import {
  emptyFakeBorrower,
  completeFakeBorrower,
} from '../../api/borrowers/fakes';
import { fakeProperty } from '../../api/properties/fakes';
import { emptyLoan, loanStep1, loanStep2 } from '../../api/loans/fakes';

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
  completeFiles,
  twoBorrowers,
}) => {
  const loanId = createFakeLoan({
    userId,
    step,
    completeFiles,
    twoBorrowers,
  });
  createFakeOffer(loanId);
};

// Create a test user used in app's e2e tests and all the fixtures it needs
const createTestUserWithData = () => {
  const testUserId = createUser(E2E_USER_EMAIL, ROLES.USER);
  const admins = getAdmins();

  // Create 2 loans to check AppPage, which requires multiple loans to display
  createFakeLoanFixture({
    step: STEPS.SOLVENCY,
    userId: testUserId,
    adminId: admins[0]._id,
    completeFiles: true,
    twoBorrowers: true,
  });
  createFakeLoanFixture({
    step: STEPS.REQUEST,
    userId: testUserId,
    adminId: admins[0]._id,
    completeFiles: true,
    twoBorrowers: true,
  });
};

Meteor.methods({
  generateTestData(currentUserEmail) {
    try {
      if (isAuthorizedToRun()) {
        const devs = createDevs(currentUserEmail);
        const admins = getAdmins();
        const newUsers = createFakeUsers(USER_COUNT, ROLES.USER);
        createOrganisations();

        // for each regular fixture user, create a loan with a certain step
        newUsers.forEach((userId, index) => {
          const adminId = admins[Math.floor(Math.random() * admins.length)];

          // based on index, always generate 0, 1 and 2 numbers
          const loanStep = index % 3;

          range(LOANS_PER_USER).forEach((_, loanIndex) => {
            const step = LOANS_PER_USER < 3 ? loanStep : loanIndex % 3;
            createFakeLoanFixture({
              step: STEP_ORDER[step],
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
    } catch (error) {
      // FIXME: If you throw an error here it does not appear without this
      // try catch block
      console.log('generateTestData error', error);
    }
  },

  async purgeDatabase(currentUserId) {
    check(currentUserId, String);
    if (SecurityService.checkCurrentUserIsDev() && isAuthorizedToRun()) {
      await Promise.all([
        Borrowers.rawCollection().remove({}),
        Contacts.rawCollection().remove({}),
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
    if (SecurityService.checkCurrentUserIsDev() && isAuthorizedToRun()) {
      let fakeUsersIds = getFakeUsersIds();
      deleteUsersRelatedData(fakeUsersIds);

      fakeUsersIds = fakeUsersIds.filter(item => item !== currentUserId);
      deleteUsers(fakeUsersIds);
    }
  },

  purgePersonalData(currentUserId) {
    return deleteUsersRelatedData([currentUserId]);
  },

  insertBorrowerRelatedTask() {
    const borrower = Borrowers.aggregate({ $sample: { size: 1 } })[0];
    const type = TASK_TYPE.VERIFY;
    if (borrower._id) {
      return TaskService.insert({ type, borrowerId: borrower._id });
    }
  },

  insertLoanRelatedTask() {
    const loanId = Loans.aggregate({ $sample: { size: 1 } })[0]._id;
    const type = TASK_TYPE.VERIFY;
    if (loanId) {
      return TaskService.insert({ type, loanId });
    }
  },

  insertPropertyRelatedTask() {
    const propertyId = Properties.aggregate({ $sample: { size: 1 } })[0]._id;
    const type = TASK_TYPE.CUSTOM;
    if (propertyId) {
      return TaskService.insert({ type, propertyId });
    }
  },

  createFakeOffer({ loanId }) {
    SecurityService.checkCurrentUserIsDev();

    return createFakeOffer(loanId);
  },

  createFakeInterestRates({ number }) {
    SecurityService.checkCurrentUserIsDev();

    return createFakeInterestRates({ number });
  },

  addEmptyLoan({ userId, twoBorrowers, addOffers, isRefinancing }) {
    SecurityService.checkCurrentUserIsDev();

    return addLoanWithData({
      borrowers: twoBorrowers
        ? [emptyFakeBorrower, emptyFakeBorrower]
        : [emptyFakeBorrower],
      properties: [],
      loan: {
        ...emptyLoan,
        purchaseType: isRefinancing
          ? PURCHASE_TYPE.REFINANCING
          : PURCHASE_TYPE.ACQUISITION,
      },
      userId,
      addOffers,
    });
  },

  addLoanWithSomeData({ userId, twoBorrowers, addOffers, isRefinancing }) {
    SecurityService.checkCurrentUserIsDev();

    return addLoanWithData({
      borrowers: twoBorrowers
        ? [completeFakeBorrower, completeFakeBorrower]
        : [completeFakeBorrower],
      properties: [fakeProperty],
      loan: {
        ...loanStep1,
        purchaseType: isRefinancing
          ? PURCHASE_TYPE.REFINANCING
          : PURCHASE_TYPE.ACQUISITION,
      },
      userId,
      addOffers,
    });
  },

  addCompleteLoan({ userId, twoBorrowers, isRefinancing }) {
    SecurityService.checkCurrentUserIsDev();

    return addLoanWithData({
      borrowers: twoBorrowers
        ? [completeFakeBorrower, completeFakeBorrower]
        : [completeFakeBorrower],
      properties: [fakeProperty],
      loan: {
        ...loanStep2,
        purchaseType: isRefinancing
          ? PURCHASE_TYPE.REFINANCING
          : PURCHASE_TYPE.ACQUISITION,
        applicationType: APPLICATION_TYPES.FULL,
        customName: 'Ma maison à la plage',
      },
      userId,
      addOffers: true,
    });
  },

  addAnonymousLoan({ twoBorrowers, isRefinancing }) {
    SecurityService.checkCurrentUserIsDev();

    return addLoanWithData({
      borrowers: twoBorrowers
        ? [emptyFakeBorrower, emptyFakeBorrower]
        : [emptyFakeBorrower],
      properties: [],
      loan: {
        ...emptyLoan,
        purchaseType: isRefinancing
          ? PURCHASE_TYPE.REFINANCING
          : PURCHASE_TYPE.ACQUISITION,
        anonymous: true,
      },
    });
  },

  addUserToOrg() {
    SecurityService.checkCurrentUserIsDev();

    let orgId;
    const org = Organisations.findOne({ name: 'Dev Org' });

    if (org) {
      orgId = org._id;
    } else {
      orgId = Organisations.insert({
        name: 'Dev Org',
        type: ORGANISATION_TYPES.REAL_ESTATE_BROKER,
      });
    }

    Organisations.update(
      { _id: orgId },
      { $set: { userLinks: [{ _id: this.userId }] } },
    );
  },
});
