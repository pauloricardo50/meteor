import React from 'react';
import { compose } from 'recompose';

import { TranchePickerDialog } from '../../../TranchePicker';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const FinancingTranchePicker = ({
  structure: { loanTranches, disableForms },
  updateStructure,
  className,
}) => (
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
