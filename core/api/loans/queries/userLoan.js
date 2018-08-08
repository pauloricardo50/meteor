// @flow
import { Meteor } from 'meteor/meteor';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import Loans from '../loans';
import { LOAN_QUERIES, INTEREST_RATES } from '../../constants';
import type { structureType, loanTranchesType } from '../types';
import { userPropertyFragment } from '../../properties/queries/propertyFragments';

export default Loans.createQuery(LOAN_QUERIES.USER_LOAN, {
  $filter({ filters, params: { loanId } }) {
    filters.userId = Meteor.userId();
    filters._id = loanId;
  },
  $postFilter(loans, params) {
    return loans.map(formatLoanWithStructure);
  },
  userId: 1,
  user: {
    roles: 1,
  },
  name: 1,
  logic: 1,
  general: 1,
  createdAt: 1,
  updatedAt: 1,
  adminValidation: 1,
  documents: 1,
  properties: userPropertyFragment,
  borrowerIds: 1,
  borrowers: {
    firstName: 1,
    lastName: 1,
    gender: 1,
    address1: 1,
    zipCode: 1,
    city: 1,
    age: 1,
    birthPlace: 1,
    civilStatus: 1,
    childrenCount: 1,
    company: 1,
    personalBank: 1,
    isSwiss: 1,
    isUSPerson: 1,
    worksForOwnCompany: 1,
    sameAddress: 1,
    salary: 1,
    bonusExists: 1,
    bonus: 1,
    otherIncome: 1,
    expenses: 1,
    realEstate: 1,
    bankFortune: 1,
    insuranceSecondPillar: 1,
    insuranceThirdPillar: 1,
    documents: 1,
    logic: 1,
    otherFortune: 1,
    corporateBankExists: 1,
    adminValidation: 1,
  },
  offers: {
    organization: 1,
    conditions: 1,
    counterparts: 1,
    canton: 1,
    standardOffer: {
      amortization: 1,
      maxAmount: 1,
      ...Object.values(INTEREST_RATES).reduce(
        (acc, rate) => ({ ...acc, [rate]: 1 }),
        {},
      ),
    },
    counterpartOffer: {
      amortization: 1,
      maxAmount: 1,
      ...Object.values(INTEREST_RATES).reduce(
        (acc, rate) => ({ ...acc, [rate]: 1 }),
        {},
      ),
    },
  },
  userFormsEnabled: 1,
  contacts: 1,
  structures: {
    id: 1,
    amortization: 1,
    amortizationType: 1,
    secondPillarPledged: 1,
    secondPillarWithdrawal: 1,
    thirdPillarPledged: 1,
    thirdPillarWithdrawal: 1,
    name: 1,
    description: 1,
    fortuneUsed: 1,
    loanValue: 1,
    offerId: 1,
    propertyId: 1,
    propertyWork: 1,
    sortOffersBy: 1,
    wantedLoan: 1,
    propertyValue: 1,
    loanTranches: {
      type: 1,
      value: 1,
    },
  },
  selectedStructure: 1,
});

export type userLoan = {
  _id: string,
  structures: Array<structureType>,
  selectedStructure: string,
  loanTranches: loanTranchesType,
};
