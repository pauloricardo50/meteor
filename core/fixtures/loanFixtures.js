import faker from 'faker/locale/fr';

import { OWN_FUNDS_TYPES } from '../api/borrowers/borrowerConstants';
import BorrowerService from '../api/borrowers/server/BorrowerService';
import { INTEREST_RATES } from '../api/interestRates/interestRatesConstants';
import {
  APPLICATION_TYPES,
  OWN_FUNDS_USAGE_TYPES,
  PURCHASE_TYPE,
  STEPS,
} from '../api/loans/loanConstants';
import LoanService from '../api/loans/server/LoanService';
import PropertyService from '../api/properties/server/PropertyService';
import { createFakeBorrowers } from './borrowerFixtures';
import { createFakeOffer } from './offerFixtures';
import { createFakeProperty } from './propertyFixtures';

const purchaseTypes = Object.values(PURCHASE_TYPE);

const getRandomValueInArray = array =>
  array[Math.floor(Math.random() * array.length)];

const getRandomStructure = (propertyValue, borrowerId) => {
  if (!borrowerId) {
    return {};
  }
  return getRandomValueInArray([
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
};

export const createFakeLoan = ({ userId, step, twoBorrowers }) => {
  const borrowerIds = createFakeBorrowers(userId, twoBorrowers);
  const { _id: propertyId, value } = createFakeProperty(userId);
  const loan = {
    name: faker.address.streetAddress(),
    borrowerIds,
    propertyIds: [propertyId],
    purchaseType:
      purchaseTypes[Math.floor(Math.random() * purchaseTypes.length)],
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
    case STEPS.OFFERS:
      loan.step = STEPS.OFFERS;
      loan.loanTranches = [{ value: 750000, type: 'interest10' }];
      loan.applicationType = APPLICATION_TYPES.FULL;
      loan.displayWelcomeScreen = false;
      break;
    case STEPS.REQUEST:
      loan.step = STEPS.REQUEST;
      loan.applicationType = APPLICATION_TYPES.FULL;
      loan.displayWelcomeScreen = false;
      break;
    default:
      loan.step = STEPS.SOLVENCY;
  }

  return LoanService.insert({ loan, userId });
};

export const getRelatedLoansIds = usersIds =>
  LoanService.fetch({ $filters: { userId: { $in: usersIds } }, _id: 1 }).map(
    item => item._id,
  );

export const addLoanWithData = ({
  borrowers = [],
  properties = [],
  loan: loanData,
  userId,
  addOffers,
}) => {
  const loanId = LoanService.fullLoanInsert({ userId });
  LoanService.update({ loanId, object: loanData });
  const loan = LoanService.get(loanId, { structures: { id: 1 } });
  const propertyId = properties.length
    ? PropertyService.insert({ property: {}, userId })
    : undefined;

  if (propertyId) {
    LoanService.addPropertyToLoan({ propertyId, loanId });
  }

  const structureId = loan.structures[0].id;
  let borrowerId1;
  if (borrowers.length > 0) {
    borrowerId1 = BorrowerService.insert({ borrower: borrowers[0] });
    LoanService.addLink({
      id: loanId,
      linkName: 'borrowers',
      linkId: borrowerId1,
    });
  }

  LoanService.updateStructure({
    loanId,
    structureId,
    structure: {
      propertyId,
      loanTranches: [
        { type: INTEREST_RATES.YEARS_10, value: 0.8 * 1000000 },
        { type: INTEREST_RATES.YEARS_5, value: 0.2 * 1000000 },
      ],
      ...getRandomStructure(1000000, borrowerId1),
    },
  });

  if (borrowers.length > 1) {
    const borrowerId2 = BorrowerService.insert({ borrower: borrowers[1] });
    LoanService.addLink({
      id: loanId,
      linkName: 'borrowers',
      linkId: borrowerId2,
    });
  }

  if (propertyId) {
    PropertyService.update({
      propertyId,
      object: properties[0],
    });
  }

  if (addOffers) {
    const offerIds = [1, 2, 3, 4, 5].map(() => createFakeOffer(loanId));
    LoanService.updateStructure({
      loanId,
      structureId,
      structure: { offerId: getRandomValueInArray(offerIds) },
    });
  }

  return loanId;
};
