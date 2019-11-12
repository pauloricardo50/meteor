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
    structure: { wantedLoan, disableForms },
  } = props;

  // This component does not make sense if there's no wantedLoan
  if (!wantedLoan) {
    return null;
  }

  return (
    <div className={className}>
      <DialogSimple
        renderTrigger={({ handleOpen }) => (
          <MortgageNotesPickerSummary
            handleOpen={handleOpen}
            currentMortgageNotes={currentMortgageNotes}
            borrowerMortgageNotes={borrowerMortgageNotes.filter(
              ({ selected }) => selected,
            )}
            wantedLoan={wantedLoan}
            disabled={disableForms}
          />
        )}
      >
        <MortgageNotesPickerDialog {...props} />
      </DialogSimple>
    </div>
  );
};

export default MortgageNotesPickerContainer(MortgageNotesPicker);
