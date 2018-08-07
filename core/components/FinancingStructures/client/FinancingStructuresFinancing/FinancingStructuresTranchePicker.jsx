// @flow
import React from 'react';

import { compose } from 'recompose';
import { TranchePickerDialog } from '../../../TranchePicker';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';

type FinancingStructuresTranchePickerProps = {};

const FinancingStructuresTranchePicker = ({
  structure: { loanTranches },
  handleChange,
}: FinancingStructuresTranchePickerProps) => (
  <TranchePickerDialog
    initialTranches={loanTranches}
    handleSave={handleChange}
  />
);

export default compose(
  SingleStructureContainer,
  StructureUpdateContainer,
)(FinancingStructuresTranchePicker);
