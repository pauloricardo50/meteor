import { fakeFile } from 'core/api/files/files';

export const fakeBorrower = {
  firstName: 'Marie',
  lastName: 'Rochat',
  gender: 'f',
  address1: 'Chemin du Mont 3',
  zipCode: 1400,
  city: 'Yverdon-les-Bains',
  citizenships: 'Suisse, Français',
  age: 35,
  birthPlace: 'Lausanne',
  civilStatus: 'single',
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
    bonus2014: 12300,
    bonus2015: 15490,
    bonus2016: 11140,
    bonus2017: 13780,
  },
  otherIncome: [
    {
      value: 10000,
      description: 'pensionIncome',
    },
    {
      value: 15000,
      description: 'rentIncome',
    },
  ],
  expenses: [
    {
      value: 3000,
      description: 'leasing',
    },
    {
      value: 4000,
      description: 'personalLoan',
    },
  ],
  realEstate: [
    {
      value: 433000,
      loan: 240000,
      description: 'primary',
    },
  ],
  bankFortune: 300000,
  insuranceSecondPillar: 120000,
  insuranceThirdPillar: 50000,
  files: {
    identity: [fakeFile],
    taxes: [fakeFile],
    salaryCertificate: [fakeFile],
    bonus: [fakeFile],
    otherIncome: [fakeFile],
    expenses: [fakeFile],
    nonPursuitExtract: [fakeFile],
    lastSalaries: [fakeFile],
    currentMortgages: [fakeFile],
    bankAssetsChange: [fakeFile],
    pensionFundYearlyStatement: [fakeFile],
    retirementInsurancePlan: [fakeFile],
  },
  logic: {
    financeEthics: true,
    hasValidatedFinances: true,
  },
};
