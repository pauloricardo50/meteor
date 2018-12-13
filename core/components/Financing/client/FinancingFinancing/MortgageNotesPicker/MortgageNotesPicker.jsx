// @flow
import React from 'react';

import DialogSimple from '../../../../DialogSimple';
import MortgageNotesPickerSummary from './MortgageNotesPickerSummary';
import MortgageNotesPickerContainer from './MortgageNotesPickerContainer';

type MortgageNotesPickerProps = {};

const MortgageNotesPicker = ({
  className,
  structure: { mortgageNotes },
  currentMortgageNotes,
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
      <div>Hello mah dude</div>
    </DialogSimple>
  </div>
);

export default MortgageNotesPickerContainer(MortgageNotesPicker);
