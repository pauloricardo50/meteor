import { REAL_ESTATE, OTHER_INCOME, EXPENSES } from './borrowerConstants';

export const emptyFakeBorrower = {};

export const fakeBorrower = {
  firstName: 'Marie',
  lastName: 'Rochat',
  gender: 'F',
  address1: 'Chemin du Mont 3',
  zipCode: 1400,
  city: 'Yverdon-les-Bains',
  citizenships: 'Suisse, Français',
  age: 35,
  birthPlace: 'Lausanne',
  civilStatus: 'SINGLE',
  childrenCount: 2,
  company: 'Deloitte',
  personalBank: 'BCGE',
  isSwiss: true,
  isUSPerson: false,
  worksForOwnCompany: false,
  sameAddress: true,
};

export const completeFakeBorrower = {
  ...fakeBorrower,
  salary: 300000,
  bonusExists: true,
  bonus: {
    bonus2015: 15490,
    bonus2016: 11140,
    bonus2017: 13780,
    bonus2018: 12300,
  },
  otherIncome: [
    {
      value: 10000,
      description: OTHER_INCOME.PENSIONS,
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
      description: REAL_ESTATE.MAIN_RESIDENCE,
    },
  ],
  bankFortune: 300000,
  insuranceSecondPillar: 120000,
  insuranceThirdPillar: 50000,
  logic: {},
};
