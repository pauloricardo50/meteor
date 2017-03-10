import constants from './constants';

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


export const changeProperty = (state, o, property) => {
  if (state.fortune.auto && state.income.auto) {
    o.fortune.minValue = Math.round(property * 0.2);
    o.income.minValue = Math.round(3 * property * (constants.maintenance + (0.8 * constants.loanCost)));
  } else if (state.fortune.auto) {

  } else if (state.income.auto) {
  }

  o = setDefaultMinValues(state, o);

  return o;
};


export const changeFortune = (state, o, fortune) => {
  if (state.property.auto && state.income.auto) {
    o.property.minValue = Math.round(fortune / 0.2);
    o.income.minValue = Math.round((fortune / 0.2) * constants.propertyToIncome());
  } else if (state.property.auto) {
    o.property.minValue = Math.min(
      Math.round(fortune / 0.2),
      Math.round(state.income.value / constants.propertyToIncome()),
    );
  }

  o = setDefaultMinValues(state, o);

  return o;
};


export const changeIncome = (state, o, income) => {
  if (state.property.auto && state.fortune.auto) {
    o.property.minValue = Math.round(income / constants.propertyToIncome());
    o.fortune.minValue = o.property.minValue * 0.2;
  } else if (state.property.auto) {
    o.property.minValue = Math.min(
      Math.round(state.fortune.value / 0.2),
      Math.round(income / constants.propertyToIncome()),
    );
  }

  o = setDefaultMinValues(state, o);

  return o;
};
