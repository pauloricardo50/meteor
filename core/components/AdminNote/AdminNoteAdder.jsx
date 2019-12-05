// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { adminNotesSchema } from 'core/api/loans/schemas/otherSchemas';
import {
  loanSetAdminNote,
  loanRemoveAdminNote,
} from 'core/api/loans/methodDefinitions';
import { AutoFormDialog } from '../AutoForm2';
import Button from '../Button';

const schema = new SimpleSchema(adminNotesSchema)
  .getObjectSchema('adminNotes.$')
  .omit('updatedBy', 'id');

const AdminNoteSetter = ({ adminNote, loanId, buttonProps }) => (
  <AutoFormDialog
    title={adminNote ? 'Modifier note' : 'Ajouter une note'}
    buttonProps={buttonProps}
    schema={schema}
    onSubmit={values =>
      loanSetAdminNote.run({
        loanId,
        adminNoteId: adminNote ? adminNote.id : undefined,
        note: values,
      })
    }
    model={adminNote}
    renderAdditionalActions={({ closeDialog, setDisableActions, disabled }) => {
      if (!adminNote) {
        return null;
      }

      return (
        <Button
          onClick={() => {
            setDisableActions(true);
            loanRemoveAdminNote
              .run({ loanId, adminNoteId: adminNote.id })
              .then(closeDialog)
              .finally(() => setDisableActions(false));
          }}
          error
          disabled={disabled}
        >
          Supprimer
        </Button>
      );
    }}
  />
);

export default AdminNoteSetter;
