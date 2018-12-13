// @flow
import React from 'react';

import T from '../../../../Translation';
import { toMoney } from '../../../../../utils/conversionFunctions';

type MortgageNotesPickerSummaryProps = {
  handleOpen: Function,
  currentMortgageNotes: Array<Object>,
};

const MortgageNotesPickerSummary = ({
  handleOpen,
  currentMortgageNotes,
}: MortgageNotesPickerSummaryProps) => (
  <div
    className="card-hover pointer mortgage-notes-picker-summary"
    onClick={handleOpen}
  >
    {currentMortgageNotes.length === 0 ? (
      <h4 className="text-center">
        <T id="FinancingMortgageNotesPicker.empty" />
      </h4>
    ) : (
      <span className="flex-col">
        <h4>
          <T
            id="FinancingMortgageNotesPicker.title"
            values={{ count: currentMortgageNotes.length }}
          />
        </h4>
        <p className="calculated-value">
          <span className="chf">CHF</span>{' '}
          <span className="primary">
            {toMoney(currentMortgageNotes.reduce(
              (total, { value = 0 }) => total + value,
              0,
            ))}
          </span>
        </p>
      </span>
    )}
  </div>
);

export default MortgageNotesPickerSummary;
