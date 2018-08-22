// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PercentInput from '../../../PercentInput';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';
import { getBorrowRatio } from '../FinancingStructuresResult/financingStructuresResultHelpers';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { updateStructure } from '../../../../redux/financingStructures';
import FinancingStructuresCalculator from '../FinancingStructuresCalculator';

type LoanPercentProps = {};

const LoanPercent = ({ handleChange, ...props }: LoanPercentProps) => (
  <span className="wantedLoanPercent">
    <PercentInput value={getBorrowRatio(props)} onChange={handleChange} />
  </span>
);

export default compose(
  FinancingStructuresDataContainer({ asArrays: true }),
  SingleStructureContainer,
  connect(
    null,
    (dispatch, { structureId, ...data }) => ({
      handleChange: (borrowValue) => {
        const wantedLoan = FinancingStructuresCalculator.getLoanFromBorrowRatio(
          borrowValue,
          data,
        );
        dispatch(updateStructure(structureId, { wantedLoan: Math.round(wantedLoan) }));
      },
    }),
  ),
)(LoanPercent);
