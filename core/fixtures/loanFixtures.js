import faker from 'faker/locale/fr';

import LoanService from '../api/loans/server/LoanService';
import {
  PURCHASE_TYPE,
  INTEREST_RATES,
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from '../api/constants';
import { createFakeBorrowers } from './borrowerFixtures';
import { createFakeProperty } from './propertyFixtures';
import adminLoan from '../api/loans/queries/adminLoan';
import BorrowerService from '../api/borrowers/server/BorrowerService';
import PropertyService from '../api/properties/server/PropertyService';
import { createFakeOffer } from './offerFixtures';
import { logic1, logic2, logic3 } from '../api/loans/fakes';

const purchaseTypes = Object.values(PURCHASE_TYPE);

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

  return LoanService.insert({ loan, userId });
};

export const getRelatedLoansIds = usersIds =>
  LoanService.fetch({ $filters: { userId: { $in: usersIds } }, _id: 1 }).map(item => item._id);

export const addLoanWithData = ({
  borrowers,
  properties,
  loan: loanData,
  userId,
  addOffers,
}) => {
  const loanId = LoanService.adminLoanInsert({ userId });
  LoanService.update({ loanId, object: loanData });
  const loan = adminLoan.clone({ loanId }).fetchOne();
  const propertyId = loan.properties[0]._id;
  const structureId = loan.structures[0].id;
  const [borrowerId1] = loan.borrowers.map(({ _id }) => _id);
  LoanService.updateStructure({
    loanId,
    structureId,
    structure: {
      propertyId,
      loanTranches: [
        { type: INTEREST_RATES.YEARS_10, value: 0.8 },
        { type: INTEREST_RATES.YEARS_5, value: 0.2 },
      ],
      ...getRandomStructure(1000000, borrowerId1),
    },
  });
  BorrowerService.update({ borrowerId: borrowerId1, object: borrowers[0] });

  if (borrowers.length > 1) {
    const borrowerId2 = BorrowerService.insert({ borrower: borrowers[1] });
    BorrowerService.update({ borrowerId: borrowerId2, object: borrowers[1] });
    LoanService.addLink({
      id: loanId,
      linkName: 'borrowers',
      linkId: borrowerId2,
    });
  }

  PropertyService.update({
    propertyId,
    object: properties[0],
  });

  console.log('addOffers:', addOffers);
  if (addOffers) {
    let offerIds;
    try {
      offerIds = [1, 2, 3, 4, 5].map(() => createFakeOffer(loanId));
    } catch (error) {
      console.log('error??', error);
    }
    console.log('offerIds?', offerIds);
    LoanService.updateStructure({
      loanId,
      structureId,
      structure: { offerId: getRandomValueInArray(offerIds) },
    });
  }

  return loanId;
};
