import React from 'react';
import SimpleSchema from 'simpl-schema';

import T, { Percent } from '../../../../../../components/Translation';
import {
  cutOffCriteria,
  incomeConsideration,
  theoreticalExpenses,
} from '../../../../../lenderRules/schemas/lenderRulesSchema';
import { ROW_TYPES, classes } from '../../PdfTable/PdfTable';

const RULE_TYPES = {
  SELECT: 'SELECT',
  PERCENT: 'PERCENT',
  NUMBER: 'NUMBER',
};

const getRuleArray = schemaPart =>
  Object.keys(schemaPart).map(ruleName => {
    const rule = schemaPart[ruleName];

    switch (rule.type) {
      case Number:
        return { ...rule, id: ruleName, type: RULE_TYPES.PERCENT };
      case String:
        return { ...rule, id: ruleName, type: RULE_TYPES.SELECT };
      case Array:
        return { ...rule, id: ruleName, type: RULE_TYPES.SELECT };
      case SimpleSchema.Integer:
        return { ...rule, id: ruleName, type: RULE_TYPES.NUMBER };
      default:
        return null;
    }
  });

const makeMapRule = ({ loan, calculator }) => ({ id, type, uniforms }) => {
  if (id.includes('$')) {
    return null;
  }

  const ruleOrigin = calculator.getOriginOfRule(id);

  const mappedRule = {
    label: <T id={`Forms.${id}`} />,
    detail: ruleOrigin && ruleOrigin.name,
  };
  switch (type) {
    case RULE_TYPES.SELECT:
      return {
        ...mappedRule,
        value: Array.isArray(calculator[id]) ? (
          calculator[id].map((v, index) => [
            index !== 0 && <span>,&nbsp;</span>,
            <T
              id={`Forms.${(uniforms && uniforms.intlId) || id}.${v}`}
              key={index}
            />,
          ])
        ) : (
          <T id={`Forms.${id}.${calculator[id]}`} />
        ),
      };
    case RULE_TYPES.PERCENT:
      return {
        ...mappedRule,
        value: <Percent value={calculator[id]} />,
      };
    case RULE_TYPES.NUMBER:
      return { ...mappedRule, value: calculator[id] };
    default:
      return null;
  }
};

const formatRuleIntoRow = ({ label, value, detail }, index) => (
  <tr key={index} className={classes[ROW_TYPES.REGULAR]}>
    <td>{label}</td>
    <td>{value}</td>
    <td>{detail}</td>
  </tr>
);

const getTableRows = ({ loan, calculator, schemaPart }) =>
  getRuleArray(schemaPart)
    .filter(x => x)
    .map(makeMapRule({ loan, calculator }))
    .filter(x => x)
    .map(formatRuleIntoRow);

export const getExpenseRules = ({ loan, calculator }) =>
  getTableRows({ loan, calculator, schemaPart: incomeConsideration });

export const getTheoreticalExpenseRules = ({ loan, calculator }) =>
  getTableRows({ loan, calculator, schemaPart: theoreticalExpenses });

export const getCutOffCriteriaRules = ({ loan, calculator }) =>
  getTableRows({ loan, calculator, schemaPart: cutOffCriteria });
