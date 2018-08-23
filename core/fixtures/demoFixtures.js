import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { Users } from '../api';
import UserService from '../api/users/UserService';
import LoanService from '../api/loans/LoanService';
import { ROLES, GENDER } from '../api/constants';
import BorrowerService from '../api/borrowers/BorrowerService';
import PropertyService from '../api/properties/PropertyService';

export const createYannisUser = () => {
  console.log('creating yannis...');
  const userId = Accounts.createUser({
    email: 'y@nnis.ch',
    password: 'Yannis1977',
  });

  Roles.setUserRoles(userId, ROLES.DEV);

  UserService.update({
    userId,
    object: {
      firstName: 'Yannis',
      lastName: 'Eggert',
    },
  });

  const loanId = LoanService.adminLoanInsert({ userId });
  LoanService.update({
    loanId,
    object: {
      name: 'Achat immo',
    },
  });
  const loan = LoanService.getLoanById(loanId);
  const borrower = BorrowerService.getBorrowerById(loan.borrowerIds[0]);
  BorrowerService.update({
    borrowerId: borrower._id,
    object: {
      firstName: 'Hans',
      lastName: 'Müller',
      gender: GENDER.M,
      address1: 'Rue de Lausanne 120',
      zipCode: 1201,
      city: 'Genève',
      bankFortune: 300000,
      salary: 200000,
      insuranceSecondPillar: 250000,
    },
  });
  const property = PropertyService.getPropertyById(loan.propertyIds[0]);
  PropertyService.update({
    propertyId: property._id,
    object: {
      address1: 'Avenue de Champel 29',
      zipCode: 1206,
      city: 'Genève',
      value: 2000000,
    },
  });
  console.log('Yannis created !');
};

// export const getFakeUsersIds = () => {
//     const regex = /^(admin|dev|user)-[1-9]|10@e-potek.ch/;
//     const allUsers = Users.find().fetch();
//     const fakeUserIds = allUsers
//         .filter(user => regex.test(user.emails[0].address))
//         .map(fakeUser => fakeUser._id);
//     return fakeUserIds;
// };
