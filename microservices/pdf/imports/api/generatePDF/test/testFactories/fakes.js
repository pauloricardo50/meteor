import { GENDER } from 'core/api/constants';
import { CIVIL_STATUS } from '../../../../core/api/constants';

export const FAKE_SALARY = 150000;
export const FAKE_BANK_FORTUNE = 1000000;
export const FAKE_INSURANCE_2 = { insurance2: [{ value: 200000 }] };
export const FAKE_INSURANCE_3A = { insurance3A: [{ value: 150000 }] };
export const FAKE_BANK_3A = { bank3A: [{ value: 250000 }] };
export const FAKE_INSURANCE_3B = { insurance3B: [{ value: 50000 }] };
export const FAKE_THIRD_PARTY_FORTUNE = {
  thirdPartyFortune: [{ value: 25000 }],
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

export const fakeBorrower = ({
  borrowerInfos,
  withSalary,
  withBonus,
  withBankFortune,
  withInsurance2,
  withInsurance3A,
  withBank3A,
  withInsurance3B,
  withThirdPArtyFortune,
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
  ...(withThirdPArtyFortune ? FAKE_THIRD_PARTY_FORTUNE : {}),
  ...(withOtherIncome ? FAKE_OTHER_INCOME : {}),
  ...(withOtherFortune ? FAKE_OTHER_FORTUNE : {}),
  ...(withExpenses ? FAKE_EXPENSES : {}),
  ...(withRealEstate ? FAKE_REAL_ESTATE : {}),
});
