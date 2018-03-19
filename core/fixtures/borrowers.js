import BorrowerService from 'core/api/borrowers/BorrowerService';
import {
  RESIDENCY_PERMIT,
  GENDER,
  CIVIL_STATUS,
  OTHER_FORTUNE,
  OTHER_INCOME,
  EXPENSES,
  REAL_ESTATE,
} from 'core/api/borrowers/borrowerConstants';
import { fakeDocument } from 'core/api/files/fileHelpers';

const firstNames = [
  'Marie',
  'Camille',
  'Léa',
  'Manon',
  'Thomas',
  'Nicolas',
  'Julien',
];

const lastNames = ['Arsenault', 'Babel', 'Rochat'];

const generateSecondBorrowerProbabillity = () => Math.random() < 0.8;

const insertFakeBorrower = (userId) => {
  const borrower = {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
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
        description: 'PENSION',
      },
      {
        value: 15000,
        description: 'RENT',
      },
    ],
    expenses: [
      {
        value: 3000,
        description: 'LEASING',
      },
      {
        value: 4000,
        description: 'PERSONAL_LOAN',
      },
    ],
    realEstate: [
      {
        value: 433000,
        loan: 240000,
        description: 'PRIMARY',
      },
    ],
    bankFortune: 300000,
    insuranceSecondPillar: 120000,
    insuranceThirdPillar: 50000,
    documents: {
      identity: fakeDocument,
      taxes: fakeDocument,
      salaryCertificate: fakeDocument,
      bonus: fakeDocument,
      otherIncome: fakeDocument,
      expenses: fakeDocument,
      nonPursuitExtract: fakeDocument,
      lastSalaries: fakeDocument,
      currentMortgages: fakeDocument,
      bankAssetsChange: fakeDocument,
      pensionFundYearlyStatement: fakeDocument,
      retirementInsurancePlan: fakeDocument,
    },
    logic: {
      financeEthics: true,
      hasValidatedFinances: true,
    },
  };

  return BorrowerService.insert({ borrower, userId });
};

const createFakeBorrowers = (userId) => {
  const borrowerIds = [insertFakeBorrower(userId)];
  if (generateSecondBorrowerProbabillity()) {
    borrowerIds.push(insertFakeBorrower(userId));
  }
  return borrowerIds;
};

export default createFakeBorrowers;
