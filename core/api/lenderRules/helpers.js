import jsonLogic from 'json-logic-js';

export const getMatchingRules = (lenderRules, variables) =>
  lenderRules.reduce((validRules, { filter, ...rules }) => {
    if (jsonLogic.apply(filter, variables)) {
      return { ...validRules, ...rules };
    }

    return validRules;
  }, {});

export const isAllRule = ({ filter: { and } }) => and[0] === true;

export const parseFilter = (ruleObject) => {
  if (ruleObject === true) {
    // Handle exception for rules that are true, i.e. apply to all loans
    return { value: true };
  }

  const [operator] = Object.keys(ruleObject);
  const { var: variable } = ruleObject[operator].find(o => o && o.var);
  const value = ruleObject[operator].find(o => !(o && o.var));

  return { operator, variable, value };
};

export const formatFilter = ({ variable, operator, value }) => ({
  [operator]: [{ var: variable }, value],
});
