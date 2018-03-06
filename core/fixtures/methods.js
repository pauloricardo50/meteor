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
} from 'core/api';
import UserService from 'core/api/users/UserService';
import TaskService from 'core/api/tasks/TaskService';
import { TASK_TYPE } from 'core/api/tasks/tasksConstants';
import { USER_COUNT, ADMIN_COUNT, MAX_LOANS_PER_USER } from './config';
import createFakeLoan from './loans';
import createFakeTask from './tasks';
import createFakeUsers from './users';
import createFakeOffer from './offers';

const generateNumberOfLoans = max => Math.floor(Math.random() * max + 1);

const getAdmins = () => {
  const admins = Users.find({ roles: { $in: ['admin'] } }).fetch();
  if (admins.length === 0) {
    const newAdmins = createFakeUsers(ADMIN_COUNT, 'admin');
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

Meteor.methods({
  generateTestData() {
    if (SecurityService.currentUserHasRole('dev') && !Meteor.isProduction) {
      const admins = getAdmins();
      const newUsers = createFakeUsers(USER_COUNT, 'user');
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
    if (SecurityService.currentUserHasRole('dev') && !Meteor.isProduction) {
      Borrowers.remove({});
      Loans.remove({});
      Offers.remove({});
      Properties.remove({});
      Tasks.remove({});
      Users.remove({ _id: { $ne: currentUserId } });
    }
  },

  insertBorrowerRelatedTask() {
    const borrowerId = Borrowers.findOne({})._id;
    const type = TASK_TYPE.VERIFY;
    console.log(borrowerId);
    if (borrowerId) {
      TaskService.insert({ type, borrowerId });
    }
  },

  insertLoanRelatedTask() {
    const loanId = Loans.findOne({})._id;
    const type = TASK_TYPE.VERIFY;
    if (loanId) {
      TaskService.insert({ type, loanId });
    }
  },

  insertPropertyRelatedTask() {
    const propertyId = Properties.findOne({})._id;
    const type = TASK_TYPE.CUSTOM;
    if (propertyId) {
      TaskService.insert({ type, propertyId });
    }
  },
});
