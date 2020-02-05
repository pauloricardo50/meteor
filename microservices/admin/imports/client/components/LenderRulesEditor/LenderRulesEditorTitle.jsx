//
import React from 'react';

import { LENDER_RULES_OPERATORS } from 'core/api/constants';
import T, { Percent, Money } from 'core/components/Translation';
import { parseFilter } from 'core/api/lenderRules/helpers';
import Chip from 'core/components/Material/Chip';
import { LENDER_RULES_VARIABLES } from 'imports/core/api/constants';

const operatorText = {
  [LENDER_RULES_OPERATORS.EQUALS]: '=',
  [LENDER_RULES_OPERATORS.LESS_THAN]: '<',
  [LENDER_RULES_OPERATORS.LESS_THAN_OR_EQUAL]: '<=',
  [LENDER_RULES_OPERATORS.MORE_THAN]: '>',
  [LENDER_RULES_OPERATORS.MORE_THAN_OR_EQUAL]: '>=',
  [LENDER_RULES_OPERATORS.IN]: 'dans',
};

const renderValue = (name, value) => {
  if (typeof value === 'number') {
    return value === 0 ? (
      0
    ) : value <= 1 ? (
      <Percent value={value} />
    ) : value <= 10000 ? (
      value
    ) : (
      <Money value={value} />
    );
  }

  if (Array.isArray(value)) {
    return value
      .map(v => (
        <Chip
          key={v}
          label={<T key={v} id={`Forms.${name}.${v}`} />}
          style={{ marginRight: 4 }}
        />
      ))
      .map((tag, i) => [i !== 0 && ', ', tag]);
  }

  if (name === LENDER_RULES_VARIABLES.ZIP_CODE) {
    return value;
  }

  return <T id={`Forms.${name}.${value}`} />;
};

const renderSingleVariable = ruleObject => {
  if (ruleObject === true) {
    return <T id="LenderRulesEditorTitle.all" />;
  }

  const { operator, variable, value } = parseFilter(ruleObject);

  return (
    <>
      <T id={`Forms.variable.${variable}`} />
      &nbsp;<span className="rule-operator">{operatorText[operator]}</span>
      &nbsp;
      {renderValue(variable, value)}
    </>
  );
};

const LenderRulesEditorTitle = ({ filter, name, order }) => {
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
        <h3>
          {order + 1}. {name}
        </h3>
        <h4 className="secondary">{formattedRules}</h4>
      </div>
    );
  }
  return (
    <h3>
      {order + 1}. {formattedRules}
    </h3>
  );
};

export default LenderRulesEditorTitle;
