// @flow
import React from 'react';
import { compose, withProps } from 'recompose';

import PercentInput from '../../../PercentInput';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { getBorrowRatio } from '../FinancingResult/financingResultHelpers';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingCalculator from '../FinancingCalculator';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

type LoanPercentProps = {};

const LoanPercent = ({ handleChange, ...props }: LoanPercentProps) => (
  <span className="wantedLoanPercent">
    <PercentInput value={getBorrowRatio(props)} onChange={handleChange} />
  </span>
);

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  StructureUpdateContainer,
  withProps(({ structureId, updateStructure, ...data }) => ({
    handleChange: (borrowValue) => {
      const wantedLoan = FinancingCalculator.getLoanFromBorrowRatio(
        borrowValue,
        data,
      );
      return updateStructure({ wantedLoan: Math.round(wantedLoan) });
    },
  })),
)(LoanPercent);
