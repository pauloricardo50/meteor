import { Random } from 'meteor/random';
import sample from 'lodash/sample';

import {
  EXPENSES,
  FLAT_TYPE,
  HOUSE_TYPE,
  MINERGIE_CERTIFICATE,
  OTHER_INCOME,
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
  PROPERTY_TYPE,
} from '../../../../constants';

export const FAKE_SALARY = 150000;
export const FAKE_BANK_FORTUNE = 1000000;
export const FAKE_INSURANCE_2 = { insurance2: [{ value: 200000 }] };
export const FAKE_INSURANCE_3A = { insurance3A: [{ value: 150000 }] };
export const FAKE_BANK_3A = { bank3A: [{ value: 250000 }] };
export const FAKE_INSURANCE_3B = { insurance3B: [{ value: 50000 }] };
export const FAKE_THIRD_PARTY_FORTUNE = {
  thirdPartyFortune: 5000,
};
export const FAKE_OTHER_INCOME = {
  otherIncome: [
    { description: OTHER_INCOME.PENSIONS, value: 150000 },
    { description: OTHER_INCOME.WELFARE, value: 25000 },
  ],
};
export const FAKE_OTHER_FORTUNE = {
  otherFortune: [{ value: 10000 }],
};
export const FAKE_EXPENSES = {
  expenses: [
    { description: EXPENSES.PENSIONS, value: 12000 },
    { description: EXPENSES.PERSONAL_LOAN, value: 3000 },
  ],
};

export const FAKE_REAL_ESTATE = {
  realEstate: [{ value: 1200000, loan: 850000 }],
};

export const FAKE_BONUS = {
  bonusExists: true,
  bonus2015: 2000,
  bonus2016: 5000,
  bonus2017: 1500,
  bonus2018: 5000,
};

export const FAKE_LOAN_NAME = '18-0001';
export const FAKE_USER = {
  user: {
    assignedEmployee: {
      name: 'Bob Dylan',
      email: 'bob.dylan@gmail.com',
      phoneNumber: '+41 22 577 45 23',
    },
  },
};

export const fakeOwnFunds = ({ borrowerId, type, value, usageType }) => ({
  borrowerId,
  type,
  value,
  usageType,
});

export const fakeBankFortuneWithdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.BANK_FORTUNE,
    value: 200000,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  });
export const fakeInsurance2Withdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.INSURANCE_2,
    value: 150000,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  });
export const fakeInsurance2Pledge = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.INSURANCE_2,
    value: 25000,
    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
  });
export const fakeInsurance3AWithdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.INSURANCE_3A,
    value: 85000,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  });
export const fakeInsurance3APledge = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.INSURANCE_3A,
    value: 125000,
    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
  });
export const fakeInsurance3BWithdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.INSURANCE_3B,
    value: 80000,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  });
export const fakeInsurance3BPledge = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.INSURANCE_3B,
    value: 15000,
    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
  });
export const fakeBank3AWithdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.BANK_3A,
    value: 75000,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  });
export const fakeBank3APledge = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.BANK_3A,
    value: 50000,
    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
  });
export const fakeBank3BWithdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.BANK_3B,
    value: 75000,
    usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  });
export const fakeBank3BPledge = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.BANK_3B,
    value: 18000,
    usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
  });
export const fakeThirdPartyFortuneWithdraw = borrowerId =>
  fakeOwnFunds({
    borrowerId,
    type: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
    value: 3000,
    usageType: OWN_FUNDS_TYPES.WITHDRAW,
  });

export const FAKE_WANTED_LOAN = 800000;
export const FAKE_NOTARY_FEES = 14500;

export const fakeStructure = ({
  borrowerIds,
  propertyId,
  withBank3APledge,
  withBank3AWithdraw,
  withBank3BPledge,
  withBank3BWithdraw,
  withBankWithdraw,
  withCustomNotaryFees,
  withInsurance2Pledge,
  withInsurance2Withdraw,
  withInsurance3APledge,
  withInsurance3AWithdraw,
  withInsurance3BPledge,
  withInsurance3BWithdraw,
  withThirdPartyFortuneWithdraw,
}) => ({
  id: Random.id(),
  propertyId,
  wantedLoan: FAKE_WANTED_LOAN,
  notaryFees: withCustomNotaryFees ? FAKE_NOTARY_FEES : 0.05 * FAKE_WANTED_LOAN,
  ownFunds: [
    withBankWithdraw ? fakeBankFortuneWithdraw(sample(borrowerIds)) : null,
    withInsurance2Withdraw ? fakeInsurance2Withdraw(sample(borrowerIds)) : null,
    withInsurance2Pledge ? fakeInsurance2Pledge(sample(borrowerIds)) : null,
    withInsurance3AWithdraw
      ? fakeInsurance3AWithdraw(sample(borrowerIds))
      : null,
    withInsurance3APledge ? fakeInsurance3APledge(sample(borrowerIds)) : null,
    withBank3AWithdraw ? fakeBank3AWithdraw(sample(borrowerIds)) : null,
    withBank3APledge ? fakeBank3APledge(sample(borrowerIds)) : null,
    withInsurance3BWithdraw
      ? fakeInsurance3BWithdraw(sample(borrowerIds))
      : null,
    withInsurance3BPledge ? fakeInsurance3BPledge(sample(borrowerIds)) : null,
    withBank3BWithdraw ? fakeBank3BWithdraw(sample(borrowerIds)) : null,
    withBank3BPledge ? fakeBank3BPledge(sample(borrowerIds)) : null,
    withThirdPartyFortuneWithdraw
      ? fakeThirdPartyFortuneWithdraw(sample(borrowerIds))
      : null,
  ].filter(x => x),
});

export const fakeBorrower = ({
  borrowerInfos,
  withBank3A,
  withBankFortune,
  withBonus,
  withExpenses,
  withInsurance2,
  withInsurance3A,
  withInsurance3B,
  withOtherFortune,
  withOtherIncome,
  withRealEstate,
  withSalary,
  withThirdPartyFortune,
}) => ({
  bankFortune: withBankFortune ? FAKE_BANK_FORTUNE : 0,
  salary: withSalary ? FAKE_SALARY : 0,
  ...(withBank3A ? FAKE_BANK_3A : {}),
  ...(withBonus ? FAKE_BONUS : {}),
  ...(withExpenses ? FAKE_EXPENSES : {}),
  ...(withInsurance2 ? FAKE_INSURANCE_2 : {}),
  ...(withInsurance3A ? FAKE_INSURANCE_3A : {}),
  ...(withInsurance3B ? FAKE_INSURANCE_3B : {}),
  ...(withOtherFortune ? FAKE_OTHER_FORTUNE : {}),
  ...(withOtherIncome ? FAKE_OTHER_INCOME : {}),
  ...(withRealEstate ? FAKE_REAL_ESTATE : {}),
  ...(withThirdPartyFortune ? FAKE_THIRD_PARTY_FORTUNE : {}),
  ...borrowerInfos,
});

export const FAKE_HOUSE = {
  address1: 'Rue du Succès 18',
  city: 'Lausanne',
  constructionYear: 1987,
  houseType: HOUSE_TYPE.DETACHED,
  landArea: 300,
  minergie: MINERGIE_CERTIFICATE.MINERGIE_P,
  parkingInside: 1,
  parkingOutside: 2,
  propertyType: PROPERTY_TYPE.HOUSE,
  renovationYear: 2010,
  roomCount: 5,
  volume: 1500,
  yearlyExpenses: 12000,
  zipCode: 1000,
};

export const FAKE_APPARTMENT = {
  address1: 'Rue du Succès 18',
  city: 'Lausanne',
  constructionYear: 1987,
  flatType: FLAT_TYPE.SINGLE_FLOOR_APARTMENT,
  floorNumber: 4,
  insideArea: 140,
  minergie: MINERGIE_CERTIFICATE.MINERGIE_P,
  numberOfFloors: 8,
  parkingInside: 1,
  parkingOutside: 2,
  propertyType: PROPERTY_TYPE.FLAT,
  renovationYear: 2010,
  roomCount: 5,
  yearlyExpenses: 12000,
  zipCode: 1000,
};
