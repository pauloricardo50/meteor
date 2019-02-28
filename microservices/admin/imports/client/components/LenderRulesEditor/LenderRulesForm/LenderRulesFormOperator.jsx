// @flow
import React from 'react';
import { LENDER_RULES_VARIABLES } from 'core/api/constants';
import CustomSelectField from 'core/components/AutoForm2/CustomSelectField';
import { LENDER_RULES_OPERATORS } from 'imports/core/api/constants';

type LenderRulesFormOperatorProps = {};

const LenderRulesFormOperator = (props: LenderRulesFormOperatorProps) => {
  const { model, parent } = props;
  const index = Number(parent.name.slice(-1));
  const { variable } = model.rules[index];
  const shouldDisplay = !!variable;
  let allowedValues;

  if (!shouldDisplay) {
    return null;
  }

  if (
    [
      LENDER_RULES_VARIABLES.RESIDENCE_TYPE,
      LENDER_RULES_VARIABLES.CANTON,
    ].includes(variable)
  ) {
    allowedValues = [LENDER_RULES_OPERATORS.IN];
  } else {
    allowedValues = Object.values(LENDER_RULES_OPERATORS).filter(v => v !== LENDER_RULES_OPERATORS.IN);
  }

  return (
    <CustomSelectField
      {...props}
      intlId="operator"
      allowedValues={allowedValues}
      displayEmpty={false}
      placeholder
    />
  );
};
export default LenderRulesFormOperator;
