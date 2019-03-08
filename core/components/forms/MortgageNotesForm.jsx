// @flow
import React from 'react';

import MortgageNoteSchema from 'core/api/mortgageNotes/schemas/MortgageNoteSchema';
import { mortgageNoteUpdate, mortgageNoteRemove } from 'core/api';
import message from 'core/utils/message';
import AutoForm from '../AutoForm2';
import { makeCustomAutoField } from '../AutoForm2/AutoFormComponents';
import CustomAutoFields from '../AutoForm2/CustomAutoFields';
import Button from '../Button';
import T from '../Translation';
import CustomSubmitField from '../AutoForm2/CustomSubmitField';

type MortgageNotesFormProps = {};

const handleSubmitMortgageNote = mortgageNoteId => (doc) => {
  const hideLoader = message.loading('...', 0);
  return mortgageNoteUpdate
    .run({ mortgageNoteId, object: doc })
    .finally(hideLoader)
    .then(() => message.success('Enregistré', 2));
};

const removeMortgageNote = (mortgageNoteId) => {
  const hideLoader = message.loading('...', 0);
  return mortgageNoteRemove
    .run({ mortgageNoteId })
    .finally(hideLoader)
    .then(() => message.success('Supprimé', 2));
};

const AutoField = makeCustomAutoField();

const MortgageNotesForm = ({
  mortgageNotes = [],
  insertMortgageNote,
  id,
  withCanton,
}: MortgageNotesFormProps) => {
  const ommittedFields = withCanton
    ? ['createdAt', 'updatedAt']
    : ['createdAt', 'updatedAt', 'canton'];

  return (
    <div className="space-children">
      <h3>Cédules hypothécaires</h3>
      {mortgageNotes.map(note => (
        <AutoForm
          schema={MortgageNoteSchema.omit(...ommittedFields)}
          model={note}
          onSubmit={handleSubmitMortgageNote(note._id)}
          className="form"
          key={note._id}
        >
          <CustomAutoFields autoField={AutoField} />
          <div className="flex">
            <CustomSubmitField
              raised
              primary
              label={<T id="general.save" />}
              style={{ flexGrow: 1 }}
            />
            <Button error onClick={() => removeMortgageNote(note._id)}>
              <T id="general.delete" />
            </Button>
          </div>
        </AutoForm>
      ))}
      <Button raised primary onClick={() => insertMortgageNote(id)}>
        <T id="general.add" />
      </Button>
    </div>
  );
};

export default MortgageNotesForm;
