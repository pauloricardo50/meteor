import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import UserService from '../api/users/UserService';
import LoanService from '../api/loans/LoanService';
import { ROLES, GENDER } from '../api/constants';
import BorrowerService from '../api/borrowers/BorrowerService';
import PropertyService from '../api/properties/PropertyService';

export const createYannisData = userId => {
  const loanId = LoanService.adminLoanInsert({ userId });
  LoanService.update({
    loanId,
    object: { name: '18-0000' },
  });
  const loan = LoanService.get(loanId);
  const borrower = BorrowerService.get(loan.borrowerIds[0]);
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
      insurance2: [{ value: 250000, description: 'Allianz' }],
    },
  });
  const property = PropertyService.get(loan.propertyIds[0]);
  PropertyService.update({
    propertyId: property._id,
    object: {
      address1: 'Avenue de Champel 29',
      zipCode: 1206,
      city: 'Genève',
      value: 2000000,
    },
  });
};

export const createYannisUser = () => {
  console.log('creating yannis...');
  // const userId = Accounts.createUser({
  //   email: 'y@nnis.ch',
  //   password: 'Yannis1977',
  // });

  // Roles.setUserRoles(userId, ROLES.DEV);

  // UserService.update({
  //   userId,
  //   object: { firstName: 'Yannis', lastName: 'Demo' },
  // });

  // createYannisData(userId);

  console.log('Yannis created !');
};
