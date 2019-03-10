// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import {
  LENDER_RULES_VARIABLES,
  LENDER_RULES_OPERATORS,
} from 'core/api/constants';
import LenderRulesFormValue from './LenderRulesFormValue';
import LenderRulesFormOperator from './LenderRulesFormOperator';

type LenderRulesFormProps = {};

const shouldRenderAdditionalFields = (model, index) =>
  model.rules && model.rules[index] && model.rules[index].variable;

const schema = new SimpleSchema({
  name: { type: String, optional: true },
  rules: { type: Array, minCount: 1 },
  'rules.$': Object,
  'rules.$.variable': {
    type: String,
    allowedValues: Object.values(LENDER_RULES_VARIABLES),
    uniforms: { placeholder: null, intlId: 'variable' },
  },
  'rules.$.operator': {
    type: String,
    uniforms: {
      placeholder: null,
      component: LenderRulesFormOperator,
    },
    condition: shouldRenderAdditionalFields,
  },
  'rules.$.value': {
    type: SimpleSchema.oneOf(String, Number, Boolean, Array),
    uniforms: { component: LenderRulesFormValue, placeholder: null },
    condition: shouldRenderAdditionalFields,
  },
  'rules.$.value.$': { type: String, condition: () => false },
});

const LenderRulesForm = ({
  model = {},
  onSubmit,
  buttonProps = {},
  ...otherProps
}: LenderRulesFormProps) => (
  <AutoFormDialog
    model={model}
    onSubmit={onSubmit}
    schema={schema}
    buttonProps={{
      primary: true,
      ...buttonProps,
    }}
    {...otherProps}
  />
);

export default LenderRulesForm;
