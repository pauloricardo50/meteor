import React from 'react';

import { MORTGAGE_NOTES_COLLECTION } from '../../api/constants';
import AutoForm from '../AutoForm';
import T from '../Translation';
import Button from '../Button';
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
      <T id="general.mortgageNotes" />
    </h3>
    <p className="description">
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
        collection={MORTGAGE_NOTES_COLLECTION}
        doc={mortgageNote}
        disabled={disabled}
        showDisclaimer={false}
      >
        <div className="flex center">
          <Button onClick={() => mortgageNoteRemove(mortgageNote._id)} raised>
            <T id="general.delete" />
          </Button>
        </div>
      </AutoForm>
    ))}
    <div className="flex center m-8">
      <Button onClick={mortgageNoteInsert} raised primary>
        <T id="general.add" />
      </Button>
    </div>
  </div>
);

export default MortgageNotesFormContainer(MortgageNotesForm);
