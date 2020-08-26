import { RESIDENCE_TYPE } from '../properties/propertyConstants';
import { EXPENSES, OTHER_INCOME } from './borrowerConstants';

export const emptyFakeBorrower = {};

export const fakeBorrower = {
  address1: 'Chemin du Mont 3',
  birthDate: '1980-03-01',
  children: 2,
  citizenships: 'Suisse, Français',
  city: 'Yverdon-les-Bains',
  civilStatus: 'SINGLE',
  company: 'Deloitte',
  firstName: 'Marie',
  gender: 'F',
  isSwiss: true,
  isUSPerson: false,
  lastName: 'Rochat',
  sameAddress: true,
  zipCode: 1400,
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
  bankFortune: [{ value: 300000, description: 'Crédit Suisse' }],
  insurance2: [{ value: 120000, description: 'Allianz' }],
  insurance3A: [{ value: 50000, description: 'Swisslife' }],
  hasOwnCompany: false,
};
