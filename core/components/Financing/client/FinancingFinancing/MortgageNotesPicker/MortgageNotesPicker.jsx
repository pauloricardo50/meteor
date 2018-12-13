// @flow
import React from 'react';

import DialogSimple from '../../../../DialogSimple';
import MortgageNotesPickerSummary from './MortgageNotesPickerSummary';
import MortgageNotesPickerContainer from './MortgageNotesPickerContainer';
import MortgageNotesPickerDialog from './MortgageNotesPickerDialog';

type MortgageNotesPickerProps = {};

const MortgageNotesPicker = ({
  className,
  currentMortgageNotes,
  ...data
}: MortgageNotesPickerProps) => (
  <div className={className}>
    <DialogSimple
      renderTrigger={({ handleOpen }) => (
        <MortgageNotesPickerSummary
          handleOpen={handleOpen}
          currentMortgageNotes={currentMortgageNotes}
        />
      )}
    >
      <MortgageNotesPickerDialog {...data} />
    </DialogSimple>
  </div>
);

export default MortgageNotesPickerContainer(MortgageNotesPicker);
