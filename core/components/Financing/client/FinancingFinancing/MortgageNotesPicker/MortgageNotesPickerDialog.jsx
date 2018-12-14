// @flow
import React from 'react';

import { createRoute } from '../../../../../utils/routerUtils';
import { PROPERTIES_COLLECTION } from '../../../../../api/constants';
import T from '../../../../Translation';
import UpdateField from '../../../../UpdateField';
import DropdownMenu from '../../../../DropdownMenu';
import { getProperty } from '../../FinancingCalculator';
import Link from '../../../../Link';
import MortgageNotesPickerList from './MortgageNotesPickerList';

type MortgageNotesPickerDialogProps = {};

const MortgageNotesPickerDialog = (props: MortgageNotesPickerDialogProps) => {
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

  const { canton } = property;

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
      <h3>
        <T id="FinancingMortgageNotesPicker.dialogTitle" />
      </h3>
      <h4>
        <T id="FinancingMortgageNotesPicker.propertyMortgageNotes" />
      </h4>
      <MortgageNotesPickerList mortgageNotes={currentMortgageNotes} />
      <h4>
        <T id="FinancingMortgageNotesPicker.borrowerMortgageNotes" />
      </h4>
      <MortgageNotesPickerList
        mortgageNotes={borrowerMortgageNotes}
        removeMortgageNote={removeMortgageNote}
      />

      {availableMortgageNotes.length > 0 ? (
        <span className="text-center">
          <DropdownMenu
            button
            buttonProps={{
              label: <T id="FinancingMortgageNotesPicker.addMortgageNote" />,
              raised: true,
              primary: true,
            }}
            options={availableMortgageNotes}
          />
        </span>
      ) : (
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
