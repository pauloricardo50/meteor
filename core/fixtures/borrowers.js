import faker from 'faker';
import BorrowerService from '../api/borrowers/BorrowerService';
import { fakeDocument } from '../api/files/fakes';
import { Borrowers } from '../api';

const insertFakeBorrower = (userId) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const borrower = {
    firstName,
    lastName,
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

export const createFakeBorrowers = (userId, twoBorrowers = false) => {
  const borrowerIds = [insertFakeBorrower(userId)];
  if (twoBorrowers) {
    borrowerIds.push(insertFakeBorrower(userId));
  }
  return borrowerIds;
};

export const getRelatedBorrowerIds = usersIds =>
  Borrowers.find({ userId: { $in: usersIds } }, { fields: { _id: 1 } })
    .fetch()
    .map(item => item._id);
