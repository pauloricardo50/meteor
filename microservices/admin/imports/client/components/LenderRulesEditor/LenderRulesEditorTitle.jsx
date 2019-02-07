// @flow
import React from 'react';

import { LENDER_RULES_OPERATORS } from 'core/api/constants';
import T, { Percent, Money } from 'core/components/Translation';
import { parseFilter } from 'core/api/lenderRules/helpers';

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

const renderSingleVariable = (ruleObject) => {
  if (ruleObject === true) {
    return <T id="LenderRulesEditorTitle.all" />;
  }

  const { operator, variable, value } = parseFilter(ruleObject);

  return (
    <>
      <T id={`Forms.${variable}`} />
      &nbsp;{operatorText[operator]}&nbsp;
      {renderValue(variable, value)}
    </>
  );
};

const LenderRulesEditorTitle = ({
  filter,
  name,
}: LenderRulesEditorTitleProps) => {
  const [operator] = Object.keys(filter);
  const variables = filter[operator];

  let formattedRules = '';

  if (variables.length > 1) {
    formattedRules = variables.map(renderSingleVariable).map((tag, i) => [
      i !== 0 && (
        <span>
          ,&nbsp;
          <T id={`general.${operator}`} />
          &nbsp;
        </span>
      ),
      tag,
    ]);
  } else {
    formattedRules = renderSingleVariable(variables[0]);
  }

  if (name) {
    return (
      <div className="lender-rules-title-with-name">
        <h3>{name}</h3>
        <h4 className="secondary">{formattedRules}</h4>
      </div>
    );
  }
  return <h3>{formattedRules}</h3>;
};

export default LenderRulesEditorTitle;
