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
import { TASK_TYPE } from 'core/api/tasks/taskConstants';
import {
  DEV_COUNT,
  USER_COUNT,
  ADMIN_COUNT,
  MAX_LOANS_PER_USER,
} from './config';
import createFakeLoan from './loans';
import createFakeTask from './tasks';
import createFakeUsers from './users';
import createFakeOffer from './offers';
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

      return {
        loans: Loans.find({}, { fields: { _id: 1 } }).fetch(),
      };
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
