import React from 'react';

import collectionIcons from '../../../../../arrays/collectionIcons';
import Icon from '../../../../Icon';
import { createRoute } from '../../../../../utils/routerUtils';
import {
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
} from '../../../../../api/constants';
import T from '../../../../Translation';
import Button from '../../../../Button';
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

  if (!property?._id) {
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
        <div className="flex-col center-align">
          <span className="mb-8">
            <T id="FinancingMortgageNotesPicker.emptyPropertyMortgageNotes" />
          </span>
          <Button
            primary
            raised
            link
            to={createRoute(`/loans/${loanId}/properties/${propertyId}`)}
            icon={<Icon type={collectionIcons[PROPERTIES_COLLECTION]} />}
          >
            <T id="FinancingMortgageNotesPicker.add" />
          </Button>
        </div>
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
        <div className="flex-col center-align">
          <span className="mb-8">
            <T
              id="FinancingMortgageNotesPicker.noAvailableMortgageNotes"
              values={{
                canton: (
                  <b>
                    <T id={`Forms.canton.${canton}`} />
                  </b>
                ),
              }}
            />
          </span>
          <Button
            primary
            raised
            link
            to={createRoute(`/loans/${loanId}/borrowers`)}
            icon={<Icon type={collectionIcons[BORROWERS_COLLECTION]} />}
          >
            <T id="FinancingMortgageNotesPicker.add" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MortgageNotesPickerDialog;
