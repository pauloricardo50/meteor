// @flow
import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { loanSetDisbursementDate } from 'core/api/loans/index';
import AutoForm from 'core/components/AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';

type LoanDisbursementDateProps = {
    schema: Object,
    onSubmit: Function,
    model: Object
};

const LoanDisbursementDate = ({
    schema,
    onSubmit,
    model,
}: LoanDisbursementDateProps) => (
        <AutoForm schema={schema} model={model} onSubmit={onSubmit} autosave submitFieldProps={{ showSubmitField: false }} />
    );

export default withProps(({ loan }) => ({
    schema: new SimpleSchema({
        disbursementDate: { type: Date, uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE } },
    }),
    onSubmit: ({ disbursementDate }) =>
        loanSetDisbursementDate.run({ loanId: loan._id, disbursementDate: new Date(disbursementDate) }),
    model: loan,
}))(LoanDisbursementDate);
