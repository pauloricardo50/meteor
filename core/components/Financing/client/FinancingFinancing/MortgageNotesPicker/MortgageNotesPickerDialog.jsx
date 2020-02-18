import React from 'react';

import { createRoute } from '../../../../../utils/routerUtils';
import { PROPERTIES_COLLECTION } from '../../../../../api/constants';
import T from '../../../../Translation';
import UpdateField from '../../../../UpdateField';
import { getProperty } from '../../FinancingCalculator';
import Link from '../../../../Link';
import MortgageNotesPickerList from './MortgageNotesPickerList';

const MortgageNotesPickerDialog = props => {
  const {
    borrowerMortgageNotes,
    currentMortgageNotes,
    availableMortgageNotes,
    loan: { _id: loanId },
    removeMortgageNote,
  } = props;
  const property = getProperty(props);
  if (!property) {
    return (
      <p className="description">
        <T id="FinancingMortgageNotesPicker.noProperty" />
      </p>
    );
  }

  const { canton, _id: propertyId } = property;

  if (!canton) {
    return (
      <div className="flex-col">
        <p className="description">
          <T id="FinancingMortgageNotesPicker.noCanton" />
        </p>
        <UpdateField
          doc={property}
          fields={['zipCode']}
          collection={PROPERTIES_COLLECTION}
        />
      </div>
    );
  }

  return (
    <div className="mortgage-notes-picker-dialog">
      <h4>
        <T id="FinancingMortgageNotesPicker.propertyMortgageNotes" />
      </h4>

      {currentMortgageNotes.length === 0 && (
        <Link
          to={createRoute(`/loans/${loanId}/properties/${propertyId}`)}
          className="a"
        >
          <T id="FinancingMortgageNotesPicker.emptyPropertyMortgageNotes" />
        </Link>
      )}
      <MortgageNotesPickerList mortgageNotes={currentMortgageNotes} />
      <h4>
        <T id="FinancingMortgageNotesPicker.borrowerMortgageNotes" />
      </h4>
      <MortgageNotesPickerList
        mortgageNotes={borrowerMortgageNotes}
        removeMortgageNote={removeMortgageNote}
        canton={canton}
      />
      {!borrowerMortgageNotes.filter(({ available }) => available).length && (
        <Link to={createRoute(`/loans/${loanId}/borrowers`)} className="a">
          <T
            id="FinancingMortgageNotesPicker.noAvailableMortgageNotes"
            values={{ canton: <T id={`Forms.canton.${canton}`} /> }}
          />
        </Link>
      )}
    </div>
  );
};

export default MortgageNotesPickerDialog;
