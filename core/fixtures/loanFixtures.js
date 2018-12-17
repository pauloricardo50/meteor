import LoanService from 'core/api/loans/LoanService';
import faker from 'faker';
import {
  PURCHASE_TYPE,
  AUCTION_STATUS,
  CLOSING_STEPS_TYPE,
  CLOSING_STEPS_STATUS,
  INTEREST_RATES,
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../api/constants';
import { createFakeBorrowers } from './borrowerFixtures';
import { createFakeProperty } from './propertyFixtures';
import { Loans } from '../api';

const purchaseTypes = Object.values(PURCHASE_TYPE);


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

const getRandomValueInArray = array =>
  array[Math.floor(Math.random() * array.length)];

const getRandomStructure = (propertyValue, borrowerId) =>
  getRandomValueInArray([
    {
      ownFunds: [
        {
          value: Math.round(0.15 * propertyValue),
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          borrowerId,
        },
        {
          value: Math.round(0.1 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          borrowerId,
        },
      ],
    },
    {
      ownFunds: [
        {
          value: Math.round(0.25 * propertyValue),
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          borrowerId,
        },
      ],
    },
    {
      ownFunds: [
        {
          value: Math.round(0.15 * propertyValue),
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          borrowerId,
        },
        {
          value: Math.round(0.1 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
          borrowerId,
        },
      ],
    },
    {
      ownFunds: [
        {
          value: Math.round(0.15 * propertyValue),
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          borrowerId,
        },
        {
          value: Math.round(0.05 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
          borrowerId,
        },
        {
          value: Math.round(0.05 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          borrowerId,
        },
      ],
    },
    {
      ownFunds: [
        {
          value: Math.round(0.15 * propertyValue),
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          borrowerId,
        },
        {
          value: Math.round(0.08 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_2,
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
          borrowerId,
        },
        {
          value: Math.round(0.02 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_3A,
          usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
          borrowerId,
        },
      ],
    },
    {
      ownFunds: [
        {
          value: Math.round(0.2 * propertyValue),
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          borrowerId,
        },
        {
          value: Math.round(0.05 * propertyValue),
          type: OWN_FUNDS_TYPES.INSURANCE_3B,
          usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
          borrowerId,
        },
      ],
    },
  ]);

export const createFakeLoan = ({
  userId,
  step,
  auctionStatus = AUCTION_STATUS.NONE,
  twoBorrowers,
}) => {
  const borrowerIds = createFakeBorrowers(userId, twoBorrowers);
  const { _id: propertyId, value } = createFakeProperty(userId);
  const loan = {
    name: faker.address.streetAddress(),
    borrowerIds,
    propertyIds: [propertyId],
    purchaseType: purchaseTypes[Math.floor(Math.random() * purchaseTypes.length)],
    contacts: [],
    structures: [
      {
        id: 'struct1',
        propertyId,
        loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
        wantedLoan: Math.round(0.8 * value),
        ...getRandomStructure(value, borrowerIds[0]),
      },
    ],
    selectedStructure: 'struct1',
  };

  switch (step) {
  case 3:
    loan.logic = logic3;
    loan.adminValidation = {
      bonus2017: 'Does not match with taxes location',
      bankFortune: 'Not enough',
    };

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
