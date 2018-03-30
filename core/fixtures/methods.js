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
} from './config';
import { createFakeLoan } from './loans';
import { createFakeTask, deleteUsersTasks } from './tasks';
import { createFakeUsers, getFakeUsersIds } from './users';
import { createFakeOffer } from './offers';
import { ROLES } from '../api/users/userConstants';

const isAuthorizedToRun = () => !Meteor.isProduction || Meteor.isStaging;
const generateNumberOfLoans = max => Math.floor(Math.random() * max + 1);

const getAdmins = () => {
  const admins = Users.find({ roles: { $in: [ROLES.ADMIN] } }).fetch();
  if (admins.length === 0) {
    const newAdmins = createFakeUsers(ADMIN_COUNT, ROLES.ADMIN);
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

const deleteAllUserRelatedData = (currentUserId, usersToDelete) => {
  const users = usersToDelete || [currentUserId];

  Borrowers.remove({ userId: { $in: users } });
  Properties.remove({ userId: { $in: users } });
  Offers.remove({ userId: { $in: users } });
  Users.remove({ _id: { $in: users, $ne: currentUserId } });
  Loans.remove({ userId: { $in: users } });
  deleteUsersTasks(users);
};

Meteor.methods({
  generateTestData(currentUserEmail) {
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      createFakeUsers(DEV_COUNT, ROLES.DEV, currentUserEmail);
      const admins = getAdmins();
      const newUsers = createFakeUsers(USER_COUNT, ROLES.USER);
      newUsers.map((userId) => {
        const adminId = admins[Math.floor(Math.random() * admins.length)];
        UserService.assignAdminToUser({ userId, adminId });
        const numberOfLoans = generateNumberOfLoans(MAX_LOANS_PER_USER);
        for (let i = 0; i < numberOfLoans; i += 1) {
          const loanId = createFakeLoan(userId, adminId);
          createFakeTask(loanId, adminId);
          createFakeOffer(loanId, userId);
        }
        return userId;
      });
    }
  },

  purgeDatabase(currentUserId) {
    check(currentUserId, String);
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      Borrowers.remove({});
      Loans.remove({});
      Offers.remove({});
      Properties.remove({});
      Tasks.remove({});
      Users.remove({ _id: { $ne: currentUserId } });
    }
  },

  purgeFakeData(currentUserId) {
    check(currentUserId, String);
    if (SecurityService.currentUserHasRole(ROLES.DEV) && isAuthorizedToRun()) {
      const fakeUsersIds = getFakeUsersIds();

      deleteAllUserRelatedData(currentUserId, fakeUsersIds);
    }
  },

  purgePersonalData(currentUserId) {
    deleteAllUserRelatedData(currentUserId);
  },

  insertBorrowerRelatedTask() {
    const borrower = Borrowers.aggregate({ $sample: { size: 1 } })[0];
    const type = TASK_TYPE.VERIFY;
    console.log(borrower._id);
    if (borrower._id) {
      TaskService.insert({ type, borrowerId: borrower._id });
    }
  },

  insertLoanRelatedTask() {
    const loanId = Loans.aggregate({ $sample: { size: 1 } })[0]._id;
    const type = TASK_TYPE.VERIFY;
    console.log(loanId);
    if (loanId) {
      TaskService.insert({ type, loanId });
    }
  },

  insertPropertyRelatedTask() {
    const propertyId = Properties.aggregate({ $sample: { size: 1 } })[0]._id;
    const type = TASK_TYPE.CUSTOM;
    console.log(propertyId);
    if (propertyId) {
      TaskService.insert({ type, propertyId });
    }
  },
});
