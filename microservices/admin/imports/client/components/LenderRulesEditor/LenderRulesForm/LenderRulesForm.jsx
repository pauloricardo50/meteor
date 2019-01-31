// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import {
  LENDER_RULES_VARIABLES,
  LENDER_RULES_OPERATORS,
} from 'core/api/constants';
import LenderRulesFormValue from './LenderRulesFormValue';

type LenderRulesFormProps = {};

const schema = new SimpleSchema({
  rules: Array,
  'rules.$': Object,
  'rules.$.variable': {
    type: String,
    allowedValues: Object.values(LENDER_RULES_VARIABLES),
    uniforms: { placeholder: null, intlId: 'variable' },
  },
  'rules.$.operator': {
    type: String,
    allowedValues: Object.values(LENDER_RULES_OPERATORS),
    defaultValue: LENDER_RULES_OPERATORS.EQUALS,
    uniforms: { placeholder: null, intlId: 'operator' },
  },
  'rules.$.value': {
    type: SimpleSchema.oneOf(String, Number, Boolean, Array),
    uniforms: { component: LenderRulesFormValue, placeholder: null },
    condition: (model, index) =>
      model.rules[index] && model.rules[index].variable,
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
