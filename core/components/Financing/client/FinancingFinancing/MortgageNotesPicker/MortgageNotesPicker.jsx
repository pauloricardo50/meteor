import React from 'react';

import DialogSimple from '../../../../DialogSimple';
import T from '../../../../Translation';
import MortgageNotesPickerContainer from './MortgageNotesPickerContainer';
import MortgageNotesPickerDialog from './MortgageNotesPickerDialog';
import MortgageNotesPickerSummary from './MortgageNotesPickerSummary';

const MortgageNotesPicker = props => {
  const {
    borrowerMortgageNotes,
    currentMortgageNotes,
    className,
    structure: { wantedLoan, wantedMortgageNote = wantedLoan, disableForms },
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
            wantedMortgageNote={wantedMortgageNote}
            disabled={disableForms}
          />
        )}
        title={<T id="Financing.pickMortgageNotes" />}
      >
        <MortgageNotesPickerDialog {...props} />
      </DialogSimple>
    </div>
  );
};

export default MortgageNotesPickerContainer(MortgageNotesPicker);
