// @flow
import React from 'react';

import { compose } from 'recompose';
import { TranchePickerDialog } from '../../../TranchePicker';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';

type FinancingTranchePickerProps = {};

const FinancingTranchePicker = ({
  structure: { loanTranches, disableForms },
  updateStructure,
  className,
}: FinancingTranchePickerProps) => (
  <span className={className}>
    <TranchePickerDialog
      initialTranches={loanTranches}
      handleSave={tranches => updateStructure({ loanTranches: tranches })}
      disabled={disableForms}
    />
  </span>
);

export default compose(
  SingleStructureContainer,
  StructureUpdateContainer,
)(FinancingTranchePicker);
