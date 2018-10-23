// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PercentInput from '../../../PercentInput';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { getBorrowRatio } from '../FinancingResult/financingResultHelpers';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { updateStructure } from '../../../../redux/financing';
import FinancingCalculator from '../FinancingCalculator';

type LoanPercentProps = {};

const LoanPercent = ({ handleChange, ...props }: LoanPercentProps) => (
  <span className="wantedLoanPercent">
    <PercentInput value={getBorrowRatio(props)} onChange={handleChange} />
  </span>
);

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  connect(
    null,
    (dispatch, { structureId, ...data }) => ({
      handleChange: (borrowValue) => {
        const wantedLoan = FinancingCalculator.getLoanFromBorrowRatio(
          borrowValue,
          data,
        );
        dispatch(updateStructure(structureId, { wantedLoan: Math.round(wantedLoan) }));
      },
    }),
  ),
)(LoanPercent);
