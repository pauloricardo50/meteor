// @flow
import React from 'react';

import T from 'core/components/Translation';

type LenderRulesEditorTitleProps = {};

const renderSingleVariable = (variable) => {
  const [variableOperator] = Object.keys(variable);
  const { var: variableName } = variable[variableOperator].find(operand => operand && operand.var);
  const variableValue = variable[variableOperator].find(operand => !(operand && operand.var));

  return (
    <>
      <T id={`Forms.${variableName}`} />
      :&nbsp;
      <T id={`Forms.${variableName}.${variableValue}`} />
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
