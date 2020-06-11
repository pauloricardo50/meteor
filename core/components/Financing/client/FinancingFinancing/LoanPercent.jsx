import React, { useRef } from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { connectField } from 'uniforms';

import Calculator from '../../../../utils/Calculator';
import AutoForm from '../../../AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../AutoForm2/autoFormConstants';
import PercentInput from '../../../PercentInput';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import FinancingCalculator from '../FinancingCalculator';
import { getBorrowRatio } from '../FinancingResult/financingResultHelpers';

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
      margin="dense"
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
    <AutoForm
      onSubmit={({ loanPercent }) => handleSubmit(loanPercent)}
      schema={schema}
      model={{ loanPercent: getBorrowRatio(props) }}
      disabled={props.structure.disableForms}
      submitFieldProps={{ showSubmitField: false }}
      ref={formRef}
      className="loan-percent"
    >
      <LoanPercentField formRef={formRef} name="loanPercent" />
    </AutoForm>
  );
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  StructureUpdateContainer,
  withProps(({ updateStructure, loan, structureId }) => ({
    handleSubmit: borrowRatio => {
      const propAndWork = Calculator.getPropAndWork({
        loan,
        structureId,
      });
      const wantedLoan = FinancingCalculator.getLoanFromBorrowRatio({
        borrowRatio,
        propertyValue: propAndWork,
      });
      return updateStructure({ wantedLoan: Math.round(wantedLoan) });
    },
  })),
)(LoanPercent);
