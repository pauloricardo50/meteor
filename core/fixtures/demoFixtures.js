import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import UserService from '../api/users/server/UserService';
import LoanService from '../api/loans/server/LoanService';
import BorrowerService from '../api/borrowers/server/BorrowerService';
import PropertyService from '../api/properties/server/PropertyService';
import { ROLES, GENDER } from '../api/constants';

export const createYannisData = (userId) => {
  const loanId = LoanService.fullLoanInsert({ userId });
  LoanService.update({
    loanId,
    object: { name: '18-0000' },
  });
  const loan = LoanService.get(loanId);
  BorrowerService.update({
    borrowerId: loan.borrowerIds[0],
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
  const propertyId = PropertyService.insert({
    property: {
      address1: 'Avenue de Champel 29',
      zipCode: 1206,
      city: 'Genève',
      value: 2000000,
    },
    userId,
    loanId,
  });
};

export const createYannisUser = () => {
  console.log('creating yannis...');
  const userId = Accounts.createUser({
    email: 'y@nnis.ch',
    password: 'Yannis1977',
  });

  Roles.setUserRoles(userId, ROLES.DEV);

  UserService.update({
    userId,
    object: { firstName: 'Yannis', lastName: 'Demo' },
  });

  createYannisData(userId);

  console.log('Yannis created !');
};
