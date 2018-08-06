import moment from 'moment';
import LoanService from 'core/api/loans/LoanService';
import faker from 'faker';
import { fakeDocument, fakeDocumentWithLabel } from '../api/files/fakes';
import {
  PURCHASE_TYPE,
  INSURANCE_USE_PRESET,
  AUCTION_STATUS,
  LOAN_STRATEGY_PRESET,
  AMORTIZATION_TYPE,
  CLOSING_STEPS_TYPE,
  CLOSING_STEPS_STATUS,
  INTEREST_RATES,
} from '../api/constants';
import { createFakeBorrowers } from './borrowers';
import { createFakeProperty } from './properties';
import { Loans } from '../api';

const purchaseTypes = Object.values(PURCHASE_TYPE);

const fakeGeneral = {
  purchaseType: purchaseTypes[Math.floor(Math.random() * purchaseTypes.length)],
  wantedClosingDate: moment()
    .add(15, 'd')
    .toDate(),
};

const logic1 = {};

const logic2 = {
  step: 2,
  verification: {
    requested: false,
    validated: true,
    verifiedAt: new Date(),
    comments: [],
  },
  auction: {},
};

const logic3 = {
  step: 3,
  verification: {
    requested: false,
    validated: false,
    requestedAt: new Date(),
    verifiedAt: new Date(),
    comments: [],
  },
  auction: {
    status: AUCTION_STATUS.ENDED,
    startTime: new Date(),
    endTime: new Date(),
  },
  hasValidatedStructure: true,
  insuranceUsePreset: INSURANCE_USE_PRESET.COLLATERAL,
  loanStrategyPreset: LOAN_STRATEGY_PRESET.FIXED,
  amortizationStrategyPreset: AMORTIZATION_TYPE.INDIRECT,
  lender: {},
  closingSteps: [
    {
      id: 'upload0',
      title: 'Contrat de prêt signé',
      type: CLOSING_STEPS_TYPE.UPLOAD,
    },
    {
      id: 'todo0',
      title: 'Ouverture de compte chez votre prêteur',
      description:
        'Il faut ouvrir un compte bancaire chez votre prêteur où les fonds de votre hypothèque résideront.',
      type: CLOSING_STEPS_TYPE.TODO,
      status: CLOSING_STEPS_STATUS.VALID,
    },
    {
      id: 'todo1',
      title: 'Versement des fonds propres',
      description:
        'Vous devez aller chez le notaire et verser les fonds propres nécessaires sur un compte escrow.',
      type: CLOSING_STEPS_TYPE.TODO,
      status: CLOSING_STEPS_STATUS.UNVERIFIED,
    },
    {
      id: 'todo2',
      title: 'Engagement du notaire relative aux cédules hypothécaires',
      description: '',
      type: CLOSING_STEPS_TYPE.TODO,
      status: CLOSING_STEPS_STATUS.ERROR,
      error: 'Le notaire doit vous convier à un 2ème rendez-vous',
    },
  ],
};

const fakeFiles = {
  buyersContract: fakeDocumentWithLabel,
  coownershipAllocationAgreement: fakeDocument,
  coownershipAgreement: fakeDocument,
};

const fakeFiles2 = {};

const getRandomValueInArray = array =>
  array[Math.floor(Math.random() * array.length)];

const getRandomStructure = propertyValue =>
  getRandomValueInArray([
    {
      fortuneUsed: Math.round(0.15 * propertyValue),
      secondPillarPledged: Math.round(0.1 * propertyValue),
    },
    {
      fortuneUsed: Math.round(0.25 * propertyValue),
    },
    {
      fortuneUsed: Math.round(0.15 * propertyValue),
      secondPillarWithdrawal: Math.round(0.1 * propertyValue),
    },
    {
      fortuneUsed: Math.round(0.15 * propertyValue),
      secondPillarWithdrawal: Math.round(0.05 * propertyValue),
      secondPillarPledged: Math.round(0.05 * propertyValue),
    },
    {
      fortuneUsed: Math.round(0.15 * propertyValue),
      secondPillarWithdrawal: Math.round(0.08 * propertyValue),
      thirdPillarWithdrawal: Math.round(0.02 * propertyValue),
    },
    {
      fortuneUsed: Math.round(0.2 * propertyValue),
      thirdPillarWithdrawal: Math.round(0.05 * propertyValue),
    },
  ]);

export const createFakeLoan = ({
  userId,
  step,
  completeFiles = Math.random() > 0.5,
  auctionStatus = AUCTION_STATUS.NONE,
  twoBorrowers,
}) => {
  const borrowerIds = createFakeBorrowers(userId, twoBorrowers);
  const { _id: propertyId, value } = createFakeProperty(userId);
  const loan = {
    name: faker.address.streetAddress(),
    borrowerIds,
    propertyIds: [propertyId],
    general: fakeGeneral,
    documents: fakeFiles,
    contacts: [],
    structures: [
      {
        id: 'struct1',
        propertyId,
        loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
        wantedLoan: Math.round(0.8 * value),
        ...getRandomStructure(value),
      },
    ],
    selectedStructure: 'struct1',
  };

  switch (step) {
  case 3:
    loan.logic = logic3;
    loan.adminValidation = {
      bonus_bonus2017: 'Does not match with taxes location',
      bankFortune: 'Not enough',
    };

    if (!completeFiles) {
      loan.documents = fakeFiles2;
    }

    loan.loanTranches = [{ value: 750000, type: 'interest10' }];
    break;
  case 2:
    loan.logic = logic2;
    break;
  default:
    loan.logic = logic1;
  }

  if (auctionStatus === AUCTION_STATUS.NONE) {
    loan.logic.auction = {};
  } else if (auctionStatus === AUCTION_STATUS.STARTED) {
    loan.logic.auction = {
      status: AUCTION_STATUS.STARTED,
      startTime: new Date(Date.now() - 1000),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
    };
  } else if (auctionStatus === AUCTION_STATUS.ENDED) {
    loan.logic.auction = {
      status: AUCTION_STATUS.ENDED,
      startTime: new Date(),
      endTime: new Date(),
    };
  }

  return LoanService.insert({ loan, userId });
};

export const getRelatedLoansIds = usersIds =>
  Loans.find({ userId: { $in: usersIds } }, { fields: { _id: 1 } })
    .fetch()
    .map(item => item._id);
