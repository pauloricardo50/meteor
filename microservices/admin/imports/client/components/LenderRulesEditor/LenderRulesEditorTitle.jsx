// @flow
import React from 'react';

import { LENDER_RULES_OPERATORS } from 'core/api/constants';
import T, { Percent, Money } from 'core/components/Translation';

type LenderRulesEditorTitleProps = {};

const operatorText = {
  [LENDER_RULES_OPERATORS.EQUALS]: '=',
  [LENDER_RULES_OPERATORS.LESS_THAN]: '<',
  [LENDER_RULES_OPERATORS.LESS_THAN_OR_EQUAL]: '<=',
  [LENDER_RULES_OPERATORS.MORE_THAN]: '>',
  [LENDER_RULES_OPERATORS.MORE_THAN_OR_EQUAL]: '>=',
};

const renderValue = (name, value) => {
  if (typeof value === 'number') {
    return value === 0 ? (
      0
    ) : value <= 1 ? (
      <Percent value={value} />
    ) : (
      <Money value={value} />
    );
  }

  if (Array.isArray(value)) {
    return value
      .map(v => <T key={v} id={`Forms.${name}.${v}`} />)
      .map((tag, i) => [i !== 0 && ', ', tag]);
  }

  return <T id={`Forms.${name}.${value}`} />;
};

const renderSingleVariable = (variable) => {
  if (variable === true) {
    return <T id="LenderRulesEditorTitle.all" />;
  }

  const [variableOperator] = Object.keys(variable);
  const { var: variableName } = variable[variableOperator].find(operand => operand && operand.var);
  const variableValue = variable[variableOperator].find(operand => !(operand && operand.var));

  return (
    <>
      <T id={`Forms.${variableName}`} />
      &nbsp;{operatorText[variableOperator]}&nbsp;
      {renderValue(variableName, variableValue)}
    </>
  );
};

const LenderRulesEditorTitle = ({ filter }: LenderRulesEditorTitleProps) => {
  const [operator] = Object.keys(filter);
  const variables = filter[operator];

  if (variables.length > 1) {
    return variables.map(renderSingleVariable).map((tag, i) => [
      i !== 0 && (
        <span>
          ,&nbsp;
          <T id={`general.${operator}`} />
          &nbsp;
        </span>
      ),
      tag,
    ]);
  }

  return renderSingleVariable(variables[0]);
};

export default LenderRulesEditorTitle;
