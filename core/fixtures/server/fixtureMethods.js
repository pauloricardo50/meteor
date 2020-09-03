import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import range from 'lodash/range';

import Borrowers from '../../api/borrowers';
import {
  completeFakeBorrower,
  emptyFakeBorrower,
} from '../../api/borrowers/fakes';
import BorrowerService from '../../api/borrowers/server/BorrowerService';
import Contacts from '../../api/contacts';
import { emptyLoan, loanStep1, loanStep2 } from '../../api/loans/fakes';
import {
  PURCHASE_TYPE,
  STEPS,
  STEP_ORDER,
} from '../../api/loans/loanConstants';
import Loans from '../../api/loans/loans';
import LoanService from '../../api/loans/server/LoanService';
import Lots from '../../api/lots/lots';
import Offers from '../../api/offers';
import OfferService from '../../api/offers/server/OfferService';
import Organisations from '../../api/organisations';
import { ORGANISATION_TYPES } from '../../api/organisations/organisationConstants';
import OrganisationService from '../../api/organisations/server/OrganisationService';
import PromotionLots from '../../api/promotionLots';
import PromotionOptions from '../../api/promotionOptions';
import Promotions from '../../api/promotions';
import Properties from '../../api/properties';
import { fakeProperty } from '../../api/properties/fakes';
import PropertyService from '../../api/properties/server/PropertyService';
import SecurityService from '../../api/security';
import TaskService from '../../api/tasks/server/TaskService';
import Tasks from '../../api/tasks/tasks';
import UserService from '../../api/users/server/UserService';
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
import { createTestPromotion } from '../promotionFixtures';
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
  const admins = UserService.fetch({
    $filters: { 'roles._id': ROLES.ADVISOR },
    _id: 1,
  });
  if (admins.length <= 1) {
    const newAdmins = createAdmins();
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

const deleteUsersRelatedData = usersToDelete => {
  BorrowerService.collection.remove({ userId: { $in: usersToDelete } });
  PropertyService.collection.remove({ userId: { $in: usersToDelete } });
  OfferService.collection.remove({ userId: { $in: usersToDelete } });
  LoanService.collection.remove({ userId: { $in: usersToDelete } });
};

const deleteUsers = usersToDelete =>
  UserService.collection.remove({ _id: { $in: usersToDelete } });

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
    generateOrganisations = false,
    generateUnownedLoan = false,
    generateTestUser = false,
  } = {}) {
    try {
      if (isAuthorizedToRun()) {
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
    if (SecurityService.checkUserIsDev(this.userId) && isAuthorizedToRun()) {
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
    if (SecurityService.checkUserIsDev(this.userId) && isAuthorizedToRun()) {
      let fakeUsersIds = getFakeUsersIds();
      deleteUsersRelatedData(fakeUsersIds);

      fakeUsersIds = fakeUsersIds.filter(item => item !== currentUserId);
      deleteUsers(fakeUsersIds);
    }
  },

  purgePersonalData(currentUserId) {
    SecurityService.checkUserIsDev(this.userId);
    return deleteUsersRelatedData([currentUserId]);
  },

  insertLoanRelatedTask() {
    SecurityService.checkUserIsDev(this.userId);
    const loanId = LoanService.find({}).fetch()[0]._id;
    if (loanId) {
      return TaskService.insert({
        object: { title: 'Random dev task', loanLink: { _id: loanId } },
      });
    }
  },

  createFakeOffer({ loanId }) {
    SecurityService.checkUserIsDev(this.userId);

    return createFakeOffer(loanId);
  },

  createFakeInterestRates({ number }) {
    SecurityService.checkUserIsDev(this.userId);

    return createFakeInterestRates({ number });
  },

  addEmptyLoan({ userId, twoBorrowers, addOffers, isRefinancing }) {
    SecurityService.checkUserIsDev(this.userId);

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
    SecurityService.checkUserIsDev(this.userId);
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
    SecurityService.checkUserIsDev(this.userId);
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
        customName: 'Ma maison à la plage',
      },
      userId,
      addOffers: true,
    });
  },

  addAnonymousLoan({ twoBorrowers, isRefinancing }) {
    SecurityService.checkUserIsDev(this.userId);
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
    SecurityService.checkUserIsDev(this.userId);
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

    OrganisationService.baseUpdate(
      { _id: orgId },
      {
        $set: {
          userLinks: [{ _id: this.userId, isMain: true, title: 'Dev </>' }],
        },
      },
    );
  },

  createTestPromotion(...params) {
    SecurityService.checkUserIsDev(this.userId);
    return createTestPromotion(...params);
  },
});
