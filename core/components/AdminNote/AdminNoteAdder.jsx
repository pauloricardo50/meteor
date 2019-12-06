// @flow
import React, { useMemo } from 'react';
import SimpleSchema from 'simpl-schema';

import { adminNotesSchema } from 'core/api/loans/schemas/otherSchemas';
import {
  loanSetAdminNote,
  loanRemoveAdminNote,
} from 'core/api/loans/methodDefinitions';
import { AutoFormDialog } from '../AutoForm2';
import Button from '../Button';

const getUpdateSchema = () =>
  new SimpleSchema(adminNotesSchema)
    .getObjectSchema('adminNotes.$')
    .omit('updatedBy', 'id');

const getInsertSchema = referredByUser =>
  getUpdateSchema().extend({
    notifyPro: {
      type: Boolean,
      defaultValue: false,
      condition: ({ isSharedWithPros }) =>
        referredByUser && referredByUser.name && isSharedWithPros,
      uniforms: {
        label: `Notifier ${referredByUser && referredByUser.name} avec un mail`,
      },
    },
  });

const AdminNoteSetter = ({
  adminNote,
  loanId,
  buttonProps,
  referredByUser,
}) => {
  const isInsert = !adminNote;
  const schema = useMemo(
    () => (isInsert ? getInsertSchema(referredByUser) : getUpdateSchema()),
    [],
  );

  return (
    <AutoFormDialog
      title={isInsert ? 'Ajouter une note' : 'Modifier note'}
      buttonProps={buttonProps}
      schema={schema}
      onSubmit={({ notifyPro, ...values }) =>
        loanSetAdminNote.run({
          loanId,
          adminNoteId: isInsert ? undefined : adminNote.id,
          note: values,
          notifyPro,
        })
      }
      model={adminNote}
      renderAdditionalActions={({
        closeDialog,
        setDisableActions,
        disabled,
      }) => {
        if (isInsert) {
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
};

export default AdminNoteSetter;
