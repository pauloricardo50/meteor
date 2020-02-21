import React, { useRef } from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { connectField } from 'uniforms';

import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import AutoForm from 'core/components/AutoForm2';
import PercentInput from '../../../PercentInput';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { getBorrowRatio } from '../FinancingResult/financingResultHelpers';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingCalculator from '../FinancingCalculator';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const LoanPercentField = connectField(
  ({ onChange, value, formRef, disabled }) => (
    <PercentInput
      value={value}
      onChange={onChange}
      onBlur={() => {
        if (formRef && formRef.current) {
          formRef.current.submit();
        }
      }}
      disabled={disabled}
    />
  ),
);

const schema = new SimpleSchema({
  loanPercent: {
    type: Number,
    min: 0,
    max: 1,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT, placeholder: '0.00%' },
  },
});

const LoanPercent = ({ handleSubmit, ...props }) => {
  const formRef = useRef(null);

  return (
    <span className="wantedLoanPercent">
      <AutoForm
        onSubmit={({ loanPercent }) => handleSubmit(loanPercent)}
        schema={schema}
        model={{ loanPercent: getBorrowRatio(props) }}
        disabled={props.structure.disableForms}
        submitFieldProps={{ showSubmitField: false }}
        ref={formRef}
      >
        <LoanPercentField formRef={formRef} name="loanPercent" />
      </AutoForm>
    </span>
  );
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  StructureUpdateContainer,
  withProps(({ updateStructure, ...data }) => ({
    handleSubmit: borrowValue => {
      const wantedLoan = FinancingCalculator.getLoanFromBorrowRatio(
        borrowValue,
        data,
      );
      return updateStructure({ wantedLoan: Math.round(wantedLoan) });
    },
  })),
)(LoanPercent);
