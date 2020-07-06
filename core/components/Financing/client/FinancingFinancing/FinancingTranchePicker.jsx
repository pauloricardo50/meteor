import React from 'react';
import { compose } from 'recompose';

import { TranchePickerDialog } from '../../../TranchePicker';
import { checkTranches } from '../../../TranchePicker/tranchePickerHelpers';
import T, { Money } from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const FinancingTranchePicker = ({
  structure: { loanTranches, disableForms, wantedLoan },
  updateStructure,
  className,
}) => {
  const { status, errors } = checkTranches(loanTranches, wantedLoan);

  return (
    <span className={className}>
      <TranchePickerDialog
        initialTranches={loanTranches}
        handleSave={tranches => updateStructure({ loanTranches: tranches })}
        disabled={disableForms}
        wantedLoan={wantedLoan}
      />
      {status === 'error' &&
        (errors.includes('allTypesAreNotDefined') ? (
          <div className="error flex-col center">
            <T id="TranchePicker.error.general" />
          </div>
        ) : (
          <div className="error flex-col center">
            <T
              id="TranchePicker.error.sumIsNotEqualToWantedLoan"
              values={{ wantedLoan: <Money value={wantedLoan} /> }}
            />
          </div>
        ))}
    </span>
  );
};

export default compose(
  SingleStructureContainer,
  StructureUpdateContainer,
)(FinancingTranchePicker);
