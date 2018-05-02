import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {
  Borrowers,
  Loans,
  Offers,
  Properties,
  Tasks,
  Users,
  SecurityService,
} from '../api';
import UserService from '../api/users/UserService';
import TaskService from '../api/tasks/TaskService';
import { TASK_TYPE } from '../api/tasks/taskConstants';
import {
  DEV_COUNT,
  USER_COUNT,
  ADMIN_COUNT,
  MAX_LOANS_PER_USER,
  STEPS_PER_LOAN,
} from './config';
import { createFakeLoan } from './loans';
import { createFakeTask, deleteUsersTasks } from './tasks';
import { createFakeUsers, getFakeUsersIds } from './users';
import { createFakeOffer } from './offers';
import { ROLES } from '../api/users/userConstants';

const isAuthorizedToRun = () => !Meteor.isProduction || Meteor.isStaging;

const getAdmins = (currentUserEmail) => {
  const admins = Users.find({ roles: { $in: [ROLES.ADMIN] } }).fetch();
  if (admins.length <= 1) {
    const newAdmins = createFakeUsers(
      ADMIN_COUNT,
      ROLES.ADMIN,
      currentUserEmail,
    );
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

Meteor.methods({
  generateTestData(currentUserEmail) {
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      createFakeUsers(DEV_COUNT, ROLES.DEV, currentUserEmail);
      const admins = getAdmins(currentUserEmail);
      const newUsers = createFakeUsers(
        USER_COUNT,
        ROLES.USER,
        currentUserEmail,
      );

      newUsers.map((userId) => {
        const adminId = admins[Math.floor(Math.random() * admins.length)];
        for (let i = 0; i < MAX_LOANS_PER_USER; i += 1) {
          // Make sure we always create a loan with the maximum number of steps first
          // Then those with lower number of steps
          // Example: first with 3, then with 2, then with 1, then again 3, 2, 1, etc
          const loanStep = STEPS_PER_LOAN - (i % STEPS_PER_LOAN);
          const loanId = createFakeLoan(userId, loanStep);
          createFakeTask(loanId, adminId);
          createFakeOffer(loanId, userId);
        }
        return userId;
      });

      return {
        loans: Loans.find({}, { fields: { _id: 1 } }).fetch(),
      };
    }
  },

  purgeDatabase(currentUserId) {
    check(currentUserId, String);
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      Borrowers.remove({});
      Offers.remove({});
      Loans.remove({});
      Properties.remove({});
      Tasks.remove({});
      Users.remove({ _id: { $ne: currentUserId } });
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
});
