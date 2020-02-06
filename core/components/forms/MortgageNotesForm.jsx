//
import React from 'react';
import cx from 'classnames';

import MortgageNoteSchema from '../../api/mortgageNotes/schemas/MortgageNoteSchema';
import { mortgageNoteUpdate, mortgageNoteRemove } from '../../api';
import AutoForm from '../AutoForm2';
import { CustomAutoField } from '../AutoForm2/AutoFormComponents';
import CustomAutoFields from '../AutoForm2/CustomAutoFields';
import Button from '../Button';
import T from '../Translation';
import Box from '../Box';
import CustomSubmitField from '../AutoForm2/CustomSubmitField';

const handleSubmitMortgageNote = mortgageNoteId => doc => {
  let message;
  let hideLoader;

  return import('../../utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return mortgageNoteUpdate.run({ mortgageNoteId, object: doc });
    })
    .finally(() => {
      hideLoader();
    })
    .then(() => message.success('Enregistré', 2));
};

const removeMortgageNote = mortgageNoteId => {
  let message;
  let hideLoader;

  return import('../../utils/message')
    .then(({ default: m }) => {
      message = m;
      hideLoader = message.loading('...', 0);
      return mortgageNoteRemove.run({ mortgageNoteId });
    })
    .finally(() => {
      hideLoader();
    })
    .then(() => message.success('Supprimé', 2));
};

const MortgageNotesForm = ({
  mortgageNotes = [],
  insertMortgageNote,
  id,
  withCanton,
  className,
}) => {
  const ommittedFields = withCanton
    ? ['createdAt', 'updatedAt']
    : ['createdAt', 'updatedAt', 'canton'];

  return (
    <div className={cx('admin-mortgage-note-form', className)}>
      <div className="admin-mortgage-note-form-title space-children">
        <h3>Cédules hypothécaires</h3>
        <Button raised primary onClick={() => insertMortgageNote(id)}>
          <T id="general.add" />
        </Button>
      </div>
      <div className="list">
        {mortgageNotes.map(note => (
          <AutoForm
            schema={MortgageNoteSchema.omit(...ommittedFields)}
            model={note}
            onSubmit={handleSubmitMortgageNote(note._id)}
            className="admin-mortgage-note-form-single"
            key={note._id}
          >
            <CustomAutoFields autoField={CustomAutoField} />
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
      </div>
    </div>
  );
};

export default MortgageNotesForm;
