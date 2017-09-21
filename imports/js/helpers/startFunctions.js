import constants from '../config/constants';

// if 2 values are not in auto mode, set both of their minValues to 0
const setDefaultMinValues = (s, o) => {
  const isNonAuto = [s.property, s.fortune, s.income].map(i => !i.auto && true);
  const labels = ['property', 'fortune', 'income'];
  const count = isNonAuto.reduce((tot, val) => (val ? tot + 1 : tot), 0);

  if (count === 2) {
    labels.forEach((label, i) => {
      if (isNonAuto[i]) {
        o[label].minValue = 0;
      }
    });
  }

  return o;
};

export const getMinIncome = (property, fortune) => {
  const loan = property * (1 + constants.notaryFees) - fortune;
  const m = constants.maintenance;
  const i = constants.interests;
  const mR = constants.maxRatio;

  const withAmortizing =
    (property * m + loan * (i + (loan - 0.65 * property) / (15 * loan))) / mR;

  const withoutAmortizing = (property * m + loan * i) / mR;

  return Math.ceil(Math.max(withAmortizing, withoutAmortizing) + 1);
};

export const getMinFortune = (property, income) => {
  const m = constants.maintenance;
  const i = constants.interests;
  const mR = constants.maxRatio;
  const nF = constants.notaryFees;

  // It has to cover 20% and notaryfees
  const basicValue = property * (0.2 + nF);

  // When there is very little income, go to rank 1 (basically, amortization = 0)
  const rank1Fortune = (property * (m + i * (1 + nF)) - mR * income) / i;

  // For the case that there is a reasonable amount of fortune, go to rank 2
  // Here amortization is complex and depends on the borrow Ratio
  const rank2Fortune =
    (property * (15 * m + nF + 0.35 + 15 * i * (1 + nF)) - mR * 15 * income) /
    (15 * i + 1);

  const rankFortune = Math.max(rank1Fortune, rank2Fortune);

  const maxFortune = Math.ceil(Math.max(0, rankFortune, basicValue));

  // Make sure fortune never goes above the property value
  return Math.min(maxFortune, property);
};

export const changeProperty = (state, o, property) => {
  if (state.fortune.auto && state.income.auto) {
    o.fortune.minValue = property * (0.2 + 0.05);
    o.income.minValue =
      3 * property * (constants.maintenance + 0.8 * constants.loanCost(0.8));
  } else if (state.fortune.auto) {
    o.fortune.minValue = getMinFortune(
      state.property.value,
      state.income.value,
    );
  } else if (state.income.auto) {
    o.income.minValue = getMinIncome(state.property.value, state.fortune.value);
  }

  o = setDefaultMinValues(state, o);

  return o;
};

export const changeFortune = (state, o, fortune) => {
  if (state.property.auto && state.income.auto) {
    o.property.minValue = fortune / (0.2 + 0.05);
    o.income.minValue =
      fortune / (0.2 + 0.05) * constants.propertyToIncome('primary', 0.8);
  } else if (state.property.auto) {
    o.property.minValue = constants.maxProperty(state.income.value, fortune);
  } else if (state.income.auto) {
    o.income.minValue = getMinIncome(state.property.value, state.fortune.value);
  }

  o = setDefaultMinValues(state, o);

  return o;
};

export const changeIncome = (state, o, income) => {
  if (state.property.auto && state.fortune.auto) {
    o.property.minValue = income / constants.propertyToIncome('primary', 0.8);
    o.fortune.minValue = o.property.minValue * (0.2 + 0.05);
  } else if (state.property.auto) {
    o.property.minValue = constants.maxProperty(income, state.fortune.value);
  } else if (state.fortune.auto) {
    o.fortune.minValue = getMinFortune(
      state.property.value,
      state.income.value,
    );
  }

  o = setDefaultMinValues(state, o);

  return o;
};

export const getRealMonthly = (fortune, property, borrow, interestRate) => {
  if (interestRate) {
    return Math.max(
      (property * constants.maintenanceReal +
        (property - fortune) *
          constants.loanCostReal(borrow, 15, interestRate)) /
        12,
      0,
    );
  }
  return Math.max(
    (property * constants.maintenanceReal +
      (property - fortune) * constants.loanCostReal(borrow)) /
      12,
    0,
  );
};

export const getTheoreticalMonthly = (fortune, property, borrow) =>
  Math.max(
    (property * constants.maintenance +
      (property - fortune) * constants.loanCost(borrow)) /
      12,
    0,
  );

export const getIncomeRatio = (monthly, income) => monthly / (income / 12);

export const getBorrowRatio = (property, fortune) =>
  Math.max((property * 1.05 - fortune) / property, 0);

//
// The following functions are used in Start 2 Form
//

export const isFinished = (state, minFortune) =>
  state.finalized &&
  !state.error &&
  (state.fortuneUsed + (state.insuranceFortuneUsed || 0) >= minFortune ||
    state.type === 'test');

export const getProject = (state) => {
  const property = state.propertyValue || calculateProperty(state) || 0;
  const project =
    property +
    (state.propertyWork || 0) +
    property * constants.notaryFees +
    (state.insuranceFortuneUsed * constants.lppFees || 0);
  return project || 0;
};

export const getBonusIncome = (arr = []) => {
  if (arr.length > 4) {
    // Ignore any value beyond the first 4
    arr = arr.slice(0, 4);
  }
  // Sum all values, remove the lowest one, and return 50% of their average
  const safeArray = arr.map(v => v || 0);
  const sum = safeArray.reduce((tot, val) => tot + val, 0);
  const bestSum = sum - Math.min(...safeArray);
  return 0.5 * (bestSum / 3) || 0;
};

export const getIncome = (state) => {
  const s = state;
  const bonus1 = getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]);
  const bonus2 = getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]);
  return [
    state.usageType === 'investment' ? s.propertyRent * 12 : 0,
    s.income1,
    s.income2,
    bonus1,
    bonus2,
    getOtherIncome(s.otherIncome),
  ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
};

export const getOtherIncome = (array = []) =>
  [...array.map(i => i.value || 0)].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

export const getFortune = state =>
  [state.fortune1, state.fortune2].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

export const getInsuranceFortune = state =>
  [
    state.insurance11,
    state.insurance12,
    state.insurance21,
    state.insurance22,
  ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);

export const getRealEstateFortune = (array = []) =>
  [...array.map(i => i.value - i.loan || 0)].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

export const getRealEstateValue = (array = []) =>
  [...array.map(i => i.value || 0)].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

export const getRealEstateDebt = (array = []) =>
  [...array.map(i => i.loan || 0)].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

export const getExpenses = (array = []) =>
  [...array.map(i => i.value)].reduce(
    (tot, val) => (val > 0 && tot + val) || tot,
    0,
  );

export const getMonthly = (state, borrow, toRetirement) => {
  const s = state;
  const projectValue = getProject(state);
  const propAndWork =
    s.propertyValue + (s.propertyWorkExists ? s.propertyWork : 0);

  const maintenance = propAndWork * constants.maintenance;
  const interestsAndAmortizing =
    (projectValue - (s.fortuneUsed || 0) - (s.insuranceFortuneUsed || 0)) *
    constants.loanCost(borrow, toRetirement);
  const cost = (maintenance + interestsAndAmortizing) / 12;

  return Math.max(cost, 0);
};

export const getMonthlyReal = (state, borrow, toRetirement) => {
  const s = state;
  const projectValue = getProject(state);
  const propAndWork = s.propertyValue + (s.propertyWork || 0);
  return Math.max(
    (propAndWork * constants.maintenanceReal +
      (projectValue - (s.fortuneUsed || 0) - (s.insuranceFortuneUsed || 0)) *
        constants.loanCostReal(borrow, toRetirement)) /
      12,
    0,
  );
};

export const calculateProperty = (
  fortune,
  insuranceFortune,
  income,
  usageType,
  toRetirement,
) =>
  constants.maxProperty(
    income,
    fortune,
    insuranceFortune,
    usageType,
    toRetirement,
  );

export const getLenderCount = (borrow, ratio) => {
  if (ratio > 0.38) {
    return 0;
  } else if (ratio > 1 / 3) {
    return 4;
  } else if (borrow <= 0.65) {
    return 30;
  } else if (borrow > 0.65 && borrow <= 0.9) {
    return 20;
  }

  return 0;
};

export const getRatio = (income, expenses, monthly) =>
  income - expenses !== 0 && monthly / ((income - expenses) / 12);

export const getBorrow = (totalFortune, propAndWork, fees) =>
  (totalFortune &&
    propAndWork !== 0 &&
    Math.max((propAndWork - (totalFortune - fees)) / propAndWork, 0)) ||
  0;

export const getRetirement = (state) => {
  const multiple = state.borrowerCount > 1;

  const age = multiple ? state.oldestAge : state.age;
  const gender = multiple ? state.oldestGender : state.gender;

  if (age && gender) {
    const retirement = gender === 'f' ? 64 : 65;

    return Math.max(retirement - age, 0);
  }

  return 100;
};

export const getMaxLoan = (
  state,
  income,
  fortune,
  insuranceFortune,
  toRetirement,
  propAndWork,
) => {
  const property = state.propertyValue;
  const maintenance = property * constants.maintenance;
  const mR = constants.maxRatio;
  const i = constants.interests;

  const maxLoan =
    state.usageType === 'secondary'
      ? Math.floor(0.7 * propAndWork)
      : Math.floor(0.8 * propAndWork);

  // Check LaTeX document, equation 15, and solve for the loan
  const calculatedMaxLoan =
    (toRetirement * (mR * income - maintenance) + 0.65 * property) /
    (i * toRetirement + 1);

  // Floor this value to make sure the user can afford it if any rounding
  // happens, If it had to round up, it would be too expensive
  return Math.floor(Math.min(maxLoan, calculatedMaxLoan));
};
