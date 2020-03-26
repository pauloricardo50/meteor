import React, { useMemo, useState } from 'react';
import SimpleSchema from 'simpl-schema';

import { adminNotesSchema } from 'core/api/loans/schemas/otherSchemas';
import {
  loanSetAdminNote,
  loanRemoveAdminNote,
} from 'core/api/loans/methodDefinitions';
import useSearchParams from 'core/hooks/useSearchParams';
import { AutoFormDialog } from '../AutoForm2';
import Button from '../Button';
import useLoanContacts from './useLoanContacts';

const getUpdateSchema = () =>
  new SimpleSchema(adminNotesSchema)
    .getObjectSchema('adminNotes.$')
    .omit('updatedBy', 'id');

const getInsertSchema = contacts =>
  getUpdateSchema().extend({
    notifyPros: {
      type: Array,
      condition: ({ isSharedWithPros }) =>
        isSharedWithPros && contacts.length > 0,
      uniforms: {
        label: `Notifier par email`,
        checkboxes: true,
      },
      optional: true,
    },
    'notifyPros.$': {
      type: String,
      allowedValues: contacts.map(({ email }) => email),
      uniforms: {
        transform: mail => {
          const user = contacts.find(({ email }) => email === mail);
          return (
            user && (
              <span>
                {user.name} <span className="secondary">{user.title}</span>
              </span>
            )
          );
        },
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
  const [date, setDate] = useState(); // Make sure the date is always up to date, it can get stale if a tab is open for a long time
  const { loading, contacts } = useLoanContacts(loanId);
  const schema = useMemo(
    () =>
      isInsert
        ? getInsertSchema(
            contacts.filter(({ isEmailable }) => isEmailable) || [],
          )
        : getUpdateSchema(),
    [contacts],
  );

  const searchParams = useSearchParams();

  return (
    <AutoFormDialog
      title={isInsert ? 'Ajouter une note' : 'Modifier note'}
      buttonProps={buttonProps}
      schema={schema}
      openOnMount={!adminNote && searchParams?.addNote}
      onSubmit={({ notifyPros = [], ...values }) =>
        loanSetAdminNote.run({
          loanId,
          adminNoteId: isInsert ? undefined : adminNote.id,
          note: values,
          notifyPros: notifyPros.map(email => ({
            email,
            withCta: contacts.find(contact => email === contact.email).withCta,
          })),
        })
      }
      model={isInsert ? { date } : adminNote}
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
      onOpen={() => setDate(new Date())}
    />
  );
};

export default AdminNoteSetter;
