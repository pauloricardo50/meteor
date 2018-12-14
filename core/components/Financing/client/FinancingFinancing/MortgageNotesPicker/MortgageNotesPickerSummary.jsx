// @flow
import React from 'react';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';

type MortgageNotesPickerSummaryProps = {
  handleOpen: Function,
  currentMortgageNotes: Array<Object>,
  wantedLoan: Number,
};

const MortgageNotesPickerSummary = ({
  handleOpen,
  currentMortgageNotes,
  wantedLoan,
}: MortgageNotesPickerSummaryProps) => {
  const currentMortgageNotesValue = currentMortgageNotes.reduce(
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
      {currentMortgageNotes.length > 0 && (
        <>
          <h4>
            <T
              id="FinancingMortgageNotesPicker.title"
              values={{ count: currentMortgageNotes.length }}
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
