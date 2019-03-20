import faker from 'faker/locale/fr';

import BorrowerService from '../api/borrowers/server/BorrowerService';
import { RESIDENCE_TYPE, OTHER_INCOME, EXPENSES } from '../api/constants';

const insertFakeBorrower = (userId) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const borrower = {
    firstName,
    lastName,
    gender: 'F',
    address1: faker.address.streetAddress(),
    zipCode: 1201,
    city: 'Genève',
    citizenships: 'Suisse, Français',
    birthDate: '1980-03-01',
    birthPlace: 'Plan-les-Ouates',
    civilStatus: 'SINGLE',
    childrenCount: 2,
    company: faker.company.companyName(),
    personalBank: 'BCGE',
    isSwiss: true,
    isUSPerson: false,
    worksForOwnCompany: false,
    sameAddress: true,

    salary: 300000,
    bonusExists: true,
    bonus2015: 15490,
    bonus2016: 11140,
    bonus2017: 13780,
    bonus2018: 12300,
    otherIncome: [
      {
        value: 10000,
        description: OTHER_INCOME.PENSIONS,
      },
      {
        value: 15000,
        description: OTHER_INCOME.WELFARE,
      },
    ],
    expenses: [
      {
        value: 3000,
        description: EXPENSES.LEASING,
      },
      {
        value: 4000,
        description: EXPENSES.PERSONAL_LOAN,
      },
    ],
    realEstate: [
      {
        value: 433000,
        loan: 240000,
        description: RESIDENCE_TYPE.MAIN_RESIDENCE,
      },
    ],
    bankFortune: 300000,
    insurance2: [{ value: 120000, description: 'Allianz' }],
    insurance3B: [{ value: 50000, description: 'Zurich' }],
    logic: {},
  };

  return BorrowerService.insert({ borrower, userId });
};

export const createFakeBorrowers = (userId, twoBorrowers = false) => {
  const borrowerIds = [insertFakeBorrower(userId)];
  if (twoBorrowers) {
    borrowerIds.push(insertFakeBorrower(userId));
  }
  return borrowerIds;
};

export const getRelatedBorrowerIds = usersIds =>
  BorrowerService.fetch({
    $filters: { userId: { $in: usersIds } },
    _id: 1,
  }).map(item => item._id);
