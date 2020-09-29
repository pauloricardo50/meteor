import React from 'react';

import AutoForm from '../AutoForm';
import Button from '../Button';
import T from '../Translation';
import MortgageNotesFormContainer from './MortgageNotesFormContainer';

const MortgageNotesForm = ({
  borrowerId,
  disabled,
  getInputs,
  mortgageNoteInsert,
  mortgageNoteRemove,
  mortgageNotes = [],
  className = '',
}) => (
  <div className={className} style={{ maxWidth: 400, width: '100%' }}>
    <h3 className="text-center v-align-mortgageNotes">
      <T defaultMessage="Cédules hypothécaires" />
    </h3>
    <p className="description text-center">
      <T
        id={
          borrowerId
            ? 'MortgageNotesForm.borrowerDescription'
            : 'MortgageNotesForm.propertyDescription'
        }
      />
    </p>
    {mortgageNotes.map(mortgageNote => (
      <AutoForm
        key={mortgageNote._id}
        formClasses="card1 card-top mb-16 user-form user-form__info user-form__finance"
        inputs={getInputs(mortgageNote)}
        docId={mortgageNote._id}
        doc={mortgageNote}
        disabled={disabled}
        showDisclaimer={false}
      >
        <div className="flex center">
          <Button onClick={() => mortgageNoteRemove(mortgageNote._id)} raised>
            <T defaultMessage="Supprimer" />
          </Button>
        </div>
      </AutoForm>
    ))}
    <div className="flex center m-8">
      <Button onClick={mortgageNoteInsert} raised primary>
        <T defaultMessage="Ajouter" />
      </Button>
    </div>
  </div>
);

export default MortgageNotesFormContainer(MortgageNotesForm);
