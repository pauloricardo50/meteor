import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Borrowers, Loans, Offers, Properties, Tasks, Users } from 'core/api';
import Security from 'core/api/security';
import { USER_COUNT, ADMIN_COUNT, MAX_LOANS_PER_USER } from './config';
import createLoan from './loans';
import createTask from './tasks';
import createUsers from './users';
import createOffer from './offers';

const generateNumberOfLoans = max => Math.floor(Math.random() * max + 1);

const getAdmins = () => {
  const admins = Users.find({ roles: { $in: ['admin'] } }).fetch();
  if (admins.length === 0) {
    const newAdmins = createUsers(ADMIN_COUNT, 'admin');
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

Meteor.methods({
  generateTestData() {
    const admins = getAdmins();
    const newUsers = createUsers(USER_COUNT, 'user');
    newUsers.map((userId) => {
      const assignedTo = admins[Math.floor(Math.random() * admins.length)];
      const numberOfLoans = generateNumberOfLoans(MAX_LOANS_PER_USER);
      for (let i = 0; i < numberOfLoans; i += 1) {
        const loanId = createLoan(userId, assignedTo);
        createTask(loanId, assignedTo);
        createOffer(loanId);
      }
      return userId;
    });
  },

  purgeDatabase(currentUserId) {
    check(currentUserId, String);
    if (Security.currentUserHasRole('dev') && !Meteor.isProduction) {
      Borrowers.remove({});
      Loans.remove({});
      Offers.remove({});
      Properties.remove({});
      Tasks.remove({});
      Users.remove({ _id: { $ne: currentUserId } });
    }
  },
});
