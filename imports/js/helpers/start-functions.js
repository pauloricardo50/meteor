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
