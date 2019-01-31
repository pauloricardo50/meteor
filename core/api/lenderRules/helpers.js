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

export const isAllRule = ({ filter: { and } }) => and[0] === true;

export const parseFilter = (ruleObject) => {
  const [operator] = Object.keys(ruleObject);
  const { var: variable } = ruleObject[operator].find(o => o && o.var);
  const value = ruleObject[operator].find(o => !(o && o.var));

  return { operator, variable, value };
};
