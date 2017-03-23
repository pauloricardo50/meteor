import constants from '../config/constants';
import cleanMethod from '/imports/api/cleanMethods';

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

export const saveStartForm = (f, history) => {
  const multiple = f.borrowerCount > 1;
  const borrowerOne = {
    age: f.age,
    salary: f.income1,
    bonusExists: f.bonusExists,
    bonus: {
      2014: f.bonus11,
      2015: f.bonus21,
      2016: f.bonus31,
      2017: f.bonus41,
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
        2014: f.bonus12,
        2015: f.bonus22,
        2016: f.bonus32,
        2017: f.bonus42,
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
      insuranceFortuneUsed: 0, // TODO
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
