import jsonLogic from 'json-logic-js';

export const getAllRules = (loan, lenderRules) => {
  const { filters } = lenderRules;

  return filters.reduce((validRules, { filter, ...rules }) => {
    if (jsonLogic.apply(filter, loan)) {
      return { ...validRules, ...rules };
    }

    return validRules;
  }, {});
};
