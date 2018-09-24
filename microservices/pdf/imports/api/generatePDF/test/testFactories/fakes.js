import { Random } from 'meteor/random';

import {
  GENDER,
  MINERGIE_CERTIFICATE,
  FLAT_TYPE,
  OWN_FUNDS_TYPES,
  OWN_FUNDS_USAGE_TYPES,
} from 'core/api/constants';
import {
  CIVIL_STATUS,
  PROPERTY_TYPE,
  HOUSE_TYPE,
} from '../../../../core/api/constants';

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
  otherIncome: [{ value: 150000 }, { value: 25000 }],
};
export const FAKE_OTHER_FORTUNE = {
  otherIncome: [{ value: 10000 }],
};
export const FAKE_EXPENSES = {
  expenses: [{ value: 12000 }, { value: 3000 }],
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
export const FAKE_USER = { user: { assignedEmployee: { name: 'Bob Dylan' } } };

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
  borrowerId,
  withCustomNotaryFees,
  withBankWithdraw,
  withInsurance2Withdraw,
  withInsurance2Pledge,
  withInsurance3AWithdraw,
  withInsurance3APledge,
  withBank3AWithdraw,
  withBank3APledge,
  withInsurance3BWithdraw,
  withInsurance3BPledge,
  withBank3BWithdraw,
  withBank3BPledge,
  withThirdPartyFortuneWithdraw,
}) => ({
  id: Random.id(),
  wantedLoan: FAKE_WANTED_LOAN,
  notaryFees: withCustomNotaryFees ? FAKE_NOTARY_FEES : 0.05 * FAKE_WANTED_LOAN,
  ownFunds: [
    withBankWithdraw ? fakeBankFortuneWithdraw(borrowerId) : null,
    withInsurance2Withdraw ? fakeInsurance2Withdraw(borrowerId) : null,
    withInsurance2Pledge ? fakeInsurance2Pledge(borrowerId) : null,
    withInsurance3AWithdraw ? fakeInsurance3AWithdraw(borrowerId) : null,
    withInsurance3APledge ? fakeInsurance3APledge(borrowerId) : null,
    withBank3AWithdraw ? fakeBank3AWithdraw(borrowerId) : null,
    withBank3APledge ? fakeBank3APledge(borrowerId) : null,
    withInsurance3BWithdraw ? fakeInsurance3BWithdraw(borrowerId) : null,
    withInsurance3BPledge ? fakeInsurance3BPledge(borrowerId) : null,
    withBank3BWithdraw ? fakeBank3BWithdraw(borrowerId) : null,
    withBank3BPledge ? fakeBank3BPledge(borrowerId) : null,
    withThirdPartyFortuneWithdraw
      ? fakeThirdPartyFortuneWithdraw(borrowerId)
      : null,
  ].filter(x => x),
});

export const fakeBorrower = ({
  borrowerInfos,
  withSalary,
  withBonus,
  withBankFortune,
  withInsurance2,
  withInsurance3A,
  withBank3A,
  withInsurance3B,
  withThirdPartyFortune,
  withOtherIncome,
  withOtherFortune,
  withExpenses,
  withRealEstate,
}) => ({
  ...borrowerInfos,
  salary: withSalary ? FAKE_SALARY : 0,
  bankFortune: withBankFortune ? FAKE_BANK_FORTUNE : 0,
  ...(withBonus ? FAKE_BONUS : {}),
  ...(withInsurance2 ? FAKE_INSURANCE_2 : {}),
  ...(withInsurance3A ? FAKE_INSURANCE_3A : {}),
  ...(withBank3A ? FAKE_BANK_3A : {}),
  ...(withInsurance3B ? FAKE_INSURANCE_3B : {}),
  ...(withThirdPartyFortune ? FAKE_THIRD_PARTY_FORTUNE : {}),
  ...(withOtherIncome ? FAKE_OTHER_INCOME : {}),
  ...(withOtherFortune ? FAKE_OTHER_FORTUNE : {}),
  ...(withExpenses ? FAKE_EXPENSES : {}),
  ...(withRealEstate ? FAKE_REAL_ESTATE : {}),
});

export const FAKE_HOUSE = {
  propertyType: PROPERTY_TYPE.HOUSE,
  houseType: HOUSE_TYPE.DETACHED,
  address1: 'Rue du Succès 18',
  zipCode: 1000,
  city: 'Lausanne',
  constructionYear: 1987,
  renovationYear: 2010,
  landArea: 300,
  volume: 1500,
  roomCount: 5,
  parkingInside: 1,
  parkingOutside: 2,
  minergie: MINERGIE_CERTIFICATE.MINERGIE_P,
  monthlyExpenses: 1200,
};

export const FAKE_APPARTMENT = {
  propertyType: PROPERTY_TYPE.FLAT,
  flatType: FLAT_TYPE.SINGLE_FLOOR_APARTMENT,
  address1: 'Rue du Succès 18',
  zipCode: 1000,
  city: 'Lausanne',
  constructionYear: 1987,
  renovationYear: 2010,
  insideArea: 140,
  roomCount: 5,
  parkingInside: 1,
  parkingOutside: 2,
  minergie: MINERGIE_CERTIFICATE.MINERGIE_P,
  monthlyExpenses: 1200,
  numberOfFloors: 8,
  floorNumber: 4,
};
