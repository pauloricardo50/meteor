import jsonLogic from 'json-logic-js';

const filterIsValid = (filter, variables) => jsonLogic.apply(filter, variables);

export const getMatchingRules = (lenderRules, variables, updateRulesCache) =>
  lenderRules.reduce((validRules, { _id, filter, ...rules }) => {
    if (filterIsValid(filter, variables)) {
      if (updateRulesCache) {
        updateRulesCache(rules, _id);
      }

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
