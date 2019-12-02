import { OTHER_INCOME, EXPENSES } from './borrowerConstants';
import { RESIDENCE_TYPE } from '../constants';

export const emptyFakeBorrower = {};

export const fakeBorrower = {
  firstName: 'Marie',
  lastName: 'Rochat',
  gender: 'F',
  address1: 'Chemin du Mont 3',
  zipCode: 1400,
  city: 'Yverdon-les-Bains',
  citizenships: 'Suisse, Français',
  birthDate: '1980-03-01',
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
  netSalary: 250000,
  bonusExists: true,
  bonus2016: 11140,
  bonus2017: 13780,
  bonus2018: 12300,
  bonus2019: 12300,
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
      description: RESIDENCE_TYPE.MAIN_RESIDENCE,
    },
  ],
  bankFortune: 300000,
  insurance2: [{ value: 120000, description: 'Allianz' }],
  insurance3A: [{ value: 50000, description: 'Swisslife' }],
  hasOwnCompany: false,
};
