import cleanMethod from '/imports/api/cleanMethods';
import constants from '../config/constants';

// if 2 values are not in auto mode, set both of their minValues to 0
const setDefaultMinValues = (s, o) => {
  const isNonAuto = [s.property, s.fortune, s.income].map(i => !i.auto && true);
  const labels = ['property', 'fortune', 'income'];
  const count = isNonAuto.reduce((tot, val) => val ? tot + 1 : tot, 0);

  if (count === 2) {
    labels.forEach((label, i) => {
      if (isNonAuto[i]) {
        o[label].minValue = 0;
      }
    });
  }

  return o;
};

export const changeProperty = (state, o, property) => {
  if (state.fortune.auto && state.income.auto) {
    o.fortune.minValue = property * (0.2 + 0.05);
    o.income.minValue = 3 *
      property *
      (constants.maintenance + 0.8 * constants.loanCost());
  } else if (state.fortune.auto) {
  } else if (state.income.auto) {
  }

  o = setDefaultMinValues(state, o);

  return o;
};

export const changeFortune = (state, o, fortune) => {
  if (state.property.auto && state.income.auto) {
    o.property.minValue = fortune / (0.2 + 0.05);
    o.income.minValue = fortune / (0.2 + 0.05) * constants.propertyToIncome();
  } else if (state.property.auto) {
    o.property.minValue = constants.maxProperty(state.income.value, fortune);
  }

  o = setDefaultMinValues(state, o);

  return o;
};

export const changeIncome = (state, o, income) => {
  if (state.property.auto && state.fortune.auto) {
    o.property.minValue = income / constants.propertyToIncome();
    o.fortune.minValue = o.property.minValue * (0.2 + 0.05);
  } else if (state.property.auto) {
    o.property.minValue = constants.maxProperty(income, state.fortune.value);
  }

  o = setDefaultMinValues(state, o);

  return o;
};

//
// The following functions are used in Start 2 Form
//

export const isFinished = (state, minFortune) =>
  state.finalized &&
  !state.error &&
  (state.fortuneUsed + (state.insuranceFortuneUsed || 0) >= minFortune ||
    state.type === 'test');

export const getProject = state => {
  const property = state.propertyValue || calculateProperty(state) || 0;
  const project = property +
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

export const getIncome = state => {
  const s = state;
  const bonus1 = getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]);
  const bonus2 = getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]);
  return [
    s.propertyRent,
    s.income1,
    s.income2,
    bonus1,
    bonus2,
    getOtherIncome(s.otherIncomeArray),
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

export const getMonthly = state => {
  const s = state;
  const projectValue = getProject(state);
  const propAndWork = s.propertyValue +
    (s.propertyWorkExists ? s.propertyWork : 0);

  const maintenance = propAndWork * constants.maintenance;
  const interestsAndAmortizing = (projectValue -
    (s.fortuneUsed || 0) -
    (s.insuranceFortuneUsed || 0)) *
    constants.loanCost();
  const cost = (maintenance + interestsAndAmortizing) / 12;

  return Math.max(cost, 0);
};

export const getMonthlyReal = state => {
  const s = state;
  const projectValue = getProject(state);
  const propAndWork = s.propertyValue + (s.propertyWork || 0);
  return Math.max(
    (propAndWork * constants.maintenanceReal +
      (projectValue - (s.fortuneUsed || 0) - (s.insuranceFortuneUsed || 0)) *
        constants.loanCostReal()) /
      12,
    0,
  );
};

export const calculateProperty = (
  fortune,
  insuranceFortune,
  income,
  usageType,
) => {
  return constants.maxProperty(income, fortune, insuranceFortune, usageType);
};

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

export const getBorrow = (totalFortune, propAndWork, propertyValue, fees) =>
  (totalFortune &&
    propAndWork !== 0 &&
    Math.max((propAndWork - (totalFortune - fees)) / propAndWork, 0)) ||
  0;

// The final function that inserts the documents once the form is finished
export const saveStartForm = (f, history) => {
  const multiple = f.borrowerCount > 1;
  const borrowerOne = {
    age: f.age,
    salary: f.income1,
    bonusExists: f.bonusExists,
    bonus: {
      bonus2014: f.bonus11,
      bonus2015: f.bonus21,
      bonus2016: f.bonus31,
      bonus2017: f.bonus41,
    },
    otherIncome: f.otherIncomeArray || [],
    expenses: f.expensesArray || [],
    realEstate: f.realEstateArray || [],
    bankFortune: f.fortune1,
    insuranceSecondPillar: f.insurance11,
    insuranceThirdPillar: f.insurance21,
  };
  let borrowerTwo = {};
  if (multiple) {
    borrowerTwo = {
      salary: f.income2,
      bonusExists: f.bonusExists,
      bonus: {
        bonus2014: f.bonus12,
        bonus2015: f.bonus22,
        bonus2016: f.bonus32,
        bonus2017: f.bonus42,
      },
      bankFortune: f.fortune2,
      insuranceSecondPillar: f.insurance12,
      insuranceThirdPillar: f.insurance22,
    };
  }

  const loanRequest = {
    general: {
      purchaseType: f.purchaseType,
      oldestAge: multiple ? f.oldestAge : f.age,
      fortuneUsed: f.fortuneUsed,
      insuranceFortuneUsed: f.insuranceFortuneUsed,
    },
    property: {
      usageType: f.usageType,
      value: f.propertyValue,
      propertyWork: f.propertyWork || 0,
      investmentRent: f.propertyRent,
    },
  };

  const insertRequest = (id1, id2 = false) => {
    loanRequest.borrowers = [id1];
    if (id2) {
      loanRequest.borrowers.push(id2);
    }
    cleanMethod(
      'insertRequest',
      loanRequest,
      undefined,
      (err, requestId) => history.push(`/app?newrequest=${requestId}`),
    );
  };

  // Insert each document
  cleanMethod('insertBorrower', borrowerOne, undefined, (err1, result1) => {
    if (multiple) {
      borrowerTwo.sameAddress = result1;
      cleanMethod(
        'insertBorrower',
        borrowerTwo,
        undefined,
        (err2, result2) => insertRequest(result1, result2),
      );
    } else {
      insertRequest(result1);
    }
  });
};
