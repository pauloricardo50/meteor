// @flow
import React from 'react';

import DialogSimple from '../../../../DialogSimple';
import MortgageNotesPickerSummary from './MortgageNotesPickerSummary';
import MortgageNotesPickerContainer from './MortgageNotesPickerContainer';
import MortgageNotesPickerDialog from './MortgageNotesPickerDialog';

type MortgageNotesPickerProps = {};

const MortgageNotesPicker = (props: MortgageNotesPickerProps) => {
  const {
    borrowerMortgageNotes,
    currentMortgageNotes,
    className,
    structure: { wantedLoan },
  } = props;
  return (
    <div className={className}>
      <DialogSimple
        renderTrigger={({ handleOpen }) => (
          <MortgageNotesPickerSummary
            handleOpen={handleOpen}
            currentMortgageNotes={currentMortgageNotes}
            borrowerMortgageNotes={borrowerMortgageNotes}
            wantedLoan={wantedLoan}
          />
        )}
      >
        <MortgageNotesPickerDialog {...props} />
      </DialogSimple>
    </div>
  );
};

export default MortgageNotesPickerContainer(MortgageNotesPicker);
