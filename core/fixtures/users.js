import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import UserService from 'core/api/users/UserService';
import Users from 'core/api/users';
import { USERS, MAX_LOANS_PER_USER } from './config';
import createLoan from './loans';
import createAdmins from './admins';
import createTask from './tasks';

import userAdminListQuery from 'core/api/users/queries/admins';

const generateNumberOfLoans = max => Math.floor(Math.random() * max + 1);

// const userService = new UserService();
// const admins = userService.getAdmins();
// const admins = userAdminListQuery.clone().fetch();

const getAdmins = () => {
  const userService = new UserService();
  const admins = userService.getAdmins();
  // const admins = Users.find({ roles: { $in: ['admin'] } }).fetch();
  if (admins.length === 0) {
    const newAdmins = createAdmins();
    return newAdmins;
  }
  return admins.map(admin => admin._id);
};

export default () => {
  const admins = getAdmins();
  for (let i = 0; i < USERS; i += 1) {
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
};
