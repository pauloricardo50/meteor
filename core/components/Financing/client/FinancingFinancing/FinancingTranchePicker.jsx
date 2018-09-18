// @flow
import React from 'react';

import { compose } from 'recompose';
import { TranchePickerDialog } from '../../../TranchePicker';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';

type FinancingTranchePickerProps = {};

const FinancingTranchePicker = ({
  structure: { loanTranches },
  handleChange,
  className,
}: FinancingTranchePickerProps) => (
  <span className={className}>
    <TranchePickerDialog
      initialTranches={loanTranches}
      handleSave={handleChange}
    />
  </span>
);

export default compose(
  SingleStructureContainer,
  StructureUpdateContainer,
)(FinancingTranchePicker);
