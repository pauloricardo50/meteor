import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import Users from 'core/api/users';
import { USERS, MAX_LOANS_PER_USER } from './config';
import createLoan from './loans';
import createAdmins from './admins';
import createTask from './tasks';

const generateNumberOfLoans = max => Math.floor(Math.random() * max + 1);

const getAdmins = () => {
  const admins = Users.find({ roles: { $in: ['admin'] } }).fetch();
  if (admins.length === 0) {
    const newAdmins = createAdmins();
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

Meteor.methods({
  generateTestData() {
    for (let i = 0; i < USERS; i += 1) {
      const admins = getAdmins();
      const assignedTo = admins[Math.floor(Math.random() * admins.length)];
      const userId = Accounts.createUser({
        email: `user-${i + 1}@epotek.ch`,
        password: '12345',
      });
      Roles.addUsersToRoles(userId, ['user']);
      let numberOfLoans = generateNumberOfLoans(MAX_LOANS_PER_USER);
      while (numberOfLoans > 0) {
        const loanId = createLoan(userId, assignedTo);
        numberOfLoans -= 1;
        createTask(loanId, assignedTo);
      }
    }
  },
});
