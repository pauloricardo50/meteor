import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { loanSetDisbursementDate } from 'core/api/loans/methodDefinitions';
import AutoForm from 'core/components/AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';

const schema = new SimpleSchema({
  disbursementDate: {
    type: Date,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.DATE,
      style: { minWidth: '300px' },
    },
  },
});

const LoanDisbursementDate = ({ onSubmit, model, ...props }) => (
  <AutoForm
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    autosave
    submitFieldProps={{ showSubmitField: false }}
    {...props}
  />
);

export default withProps(({ loan, onSubmit }) => ({
  onSubmit: ({ disbursementDate }) =>
    loanSetDisbursementDate
      .run({ loanId: loan._id, disbursementDate: new Date(disbursementDate) })
      .then(onSubmit),
  model: loan,
}))(LoanDisbursementDate);
