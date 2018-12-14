// @flow
import React from 'react';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';

type MortgageNotesPickerSummaryProps = {
  borrowerMortgageNotes: Array<Object>,
  currentMortgageNotes: Array<Object>,
  handleOpen: Function,
  wantedLoan: Number,
};

const MortgageNotesPickerSummary = ({
  borrowerMortgageNotes,
  currentMortgageNotes,
  handleOpen,
  wantedLoan,
}: MortgageNotesPickerSummaryProps) => {
  const allNotes = [...borrowerMortgageNotes, ...currentMortgageNotes];
  const currentMortgageNotesValue = allNotes.reduce(
    (total, { value = 0 }) => total + value,
    0,
  );
  return (
    <div
      className="card-hover pointer mortgage-notes-picker-summary"
      onClick={handleOpen}
    >
      {wantedLoan > currentMortgageNotesValue && (
        <>
          <h4 className="text-center">
            <T id="FinancingMortgageNotesPicker.mortgageNoteToCreate" />
          </h4>
          <p className="calculated-value">
            <span className="chf">CHF</span>{' '}
            <span className="primary">
              {toMoney(wantedLoan - currentMortgageNotesValue)}
            </span>
          </p>
        </>
      )}
      {allNotes.length > 0 && (
        <>
          <h4>
            <T
              id="FinancingMortgageNotesPicker.title"
              values={{ count: allNotes.length }}
            />
          </h4>
          <p className="calculated-value">
            <span className="chf">CHF</span>{' '}
            <span className="primary">
              {toMoney(currentMortgageNotesValue)}
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default MortgageNotesPickerSummary;
