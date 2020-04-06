import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import range from 'lodash/range';

import LoanService from 'core/api/loans/server/LoanService';

import {
  completeFakeBorrower,
  emptyFakeBorrower,
} from '../../api/borrowers/fakes';
import Borrowers from '../../api/borrowers';
import Contacts from '../../api/contacts';
import { emptyLoan, loanStep1, loanStep2 } from '../../api/loans/fakes';
import {
  APPLICATION_TYPES,
  PURCHASE_TYPE,
  STEPS,
  STEP_ORDER,
} from '../../api/loans/loanConstants';
import Loans from '../../api/loans/loans';
import Lots from '../../api/lots/lots';
import Offers from '../../api/offers';
import Organisations from '../../api/organisations';
import { ORGANISATION_TYPES } from '../../api/organisations/organisationConstants';
import OrganisationService from '../../api/organisations/server/OrganisationService';
import PromotionLots from '../../api/promotionLots';
import PromotionOptions from '../../api/promotionOptions';
import Promotions from '../../api/promotions';
import { fakeProperty } from '../../api/properties/fakes';
import Properties from '../../api/properties';
import SecurityService from '../../api/security';
import TaskService from '../../api/tasks/server/TaskService';
import Tasks from '../../api/tasks/tasks';
import { ROLES } from '../../api/users/userConstants';
import Users from '../../api/users/users';
import {
  LOANS_PER_USER,
  UNOWNED_LOANS_COUNT,
  USER_COUNT,
} from '../fixtureConfig';
import { E2E_USER_EMAIL } from '../fixtureConstants';
import { createFakeInterestRates } from '../interestRatesFixtures';
import { addLoanWithData, createFakeLoan } from '../loanFixtures';
import { createFakeOffer } from '../offerFixtures';
import { createOrganisations } from '../organisationFixtures';
import {
  createAdmins,
  createDevs,
  createFakeUsers,
  createUser,
  getFakeUsersIds,
} from '../userFixtures';

const isAuthorizedToRun = () =>
  !Meteor.isProduction || Meteor.isStaging || Meteor.isDevEnvironment;

const getAdmins = () => {
  const admins = Users.find({ roles: { $in: [ROLES.ADMIN] } }).fetch();
  if (admins.length <= 1) {
    const newAdmins = createAdmins();
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

const deleteUsersRelatedData = usersToDelete => {
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
  generateTestData({
    currentUserEmail,
    generateDevs = false,
    generateAdmins = false,
    generateUsers = false,
    generateLoans = false,
    generateOrganisations = false,
    generateUnownedLoan = false,
    generateTestUser = false,
  } = {}) {
    try {
      if (isAuthorizedToRun()) {
        let devs;
        let admins;
        let newUsers;
        if (generateDevs) {
          devs = createDevs(currentUserEmail);
        }
        if (generateAdmins) {
          admins = getAdmins();
        }
        if (generateUsers) {
          newUsers = createFakeUsers(USER_COUNT, ROLES.USER);
        }
        if (generateOrganisations) {
          createOrganisations();
        }

        if (generateUsers) {
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
        }

        if (generateUnownedLoan) {
          range(UNOWNED_LOANS_COUNT).forEach(() => {
            createFakeLoan({});
          });
        }

        if (generateTestUser) {
          createTestUserWithData();
        }
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
    SecurityService.checkCurrentUserIsDev();
    return deleteUsersRelatedData([currentUserId]);
  },

  insertLoanRelatedTask() {
    SecurityService.checkCurrentUserIsDev();
    const loanId = LoanService.find({}).fetch()[0]._id;
    if (loanId) {
      return TaskService.insert({
        object: { title: 'Random dev task', loanLink: { _id: loanId } },
      });
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
    const org = OrganisationService.get({ name: 'Dev Org' }, { _id: 1 });

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
