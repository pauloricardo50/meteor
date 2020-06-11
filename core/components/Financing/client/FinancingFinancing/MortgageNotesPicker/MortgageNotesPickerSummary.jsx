import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import Button from '../../../../Button';
import T, { Money } from '../../../../Translation';

const MortgageNotesPickerSummary = ({
  borrowerMortgageNotes,
  currentMortgageNotes,
  handleOpen,
  wantedMortgageNote,
  disabled,
}) => {
  const allNotes = [...borrowerMortgageNotes, ...currentMortgageNotes];
  const currentMortgageNotesValue = allNotes.reduce(
    (total, { value = 0 }) => total + value,
    0,
  );

  if (allNotes.length === 0) {
    return (
      <div className="text-center">
        <Button primary onClick={handleOpen} disabled={disabled}>
          <T id="general.choose" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="card-hover pointer mortgage-notes-picker-summary"
      onClick={disabled ? null : handleOpen}
    >
      {allNotes.length > 0 && (
        <p className="calculated-value">
          <span className="chf">CHF</span>{' '}
          <span className="primary">{toMoney(currentMortgageNotesValue)}</span>
        </p>
      )}
      {wantedMortgageNote > currentMortgageNotesValue && (
        <div className="flex center-align mt-8">
          <h5 className="text-center">
            <T id="FinancingMortgageNotesPicker.mortgageNoteToCreate" />:
          </h5>
          &nbsp;
          <Money value={wantedMortgageNote - currentMortgageNotesValue} />
        </div>
      )}
    </div>
  );
};

export default MortgageNotesPickerSummary;
