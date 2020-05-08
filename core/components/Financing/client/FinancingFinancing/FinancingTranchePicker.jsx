import React from 'react';
import { compose } from 'recompose';

import { toMoney } from '../../../../utils/conversionFunctions';
import { TranchePickerDialog } from '../../../TranchePicker';
import { checkTranches } from '../../../TranchePicker/tranchePickerHelpers';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const FinancingTranchePicker = ({
  structure: { loanTranches, disableForms, wantedLoan },
  updateStructure,
  className,
}) => (
  <span className={className}>
    <TranchePickerDialog
      initialTranches={loanTranches}
      handleSave={tranches => updateStructure({ loanTranches: tranches })}
      disabled={disableForms}
      wantedLoan={wantedLoan}
    />
    {!checkTranches(loanTranches, wantedLoan) && (
      <div className="error flex-col center">
        <span>Vos tranches doivent s'additionner à</span>
        <span>CHF {toMoney(wantedLoan)}</span>
      </div>
    )}
  </span>
);

export default compose(
  SingleStructureContainer,
  StructureUpdateContainer,
)(FinancingTranchePicker);
