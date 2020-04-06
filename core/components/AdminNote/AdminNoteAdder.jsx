import React, { useMemo, useState } from 'react';
import SimpleSchema from 'simpl-schema';

import { adminNotesSchema } from '../../api/helpers/sharedSchemas';
import useSearchParams from '../../hooks/useSearchParams';
import { AutoFormDialog } from '../AutoForm2';
import Button from '../Button';
import AdminNoteAdderContainer from './AdminNoteAdderContainer';

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

export const AdminNoteSetter = ({
  adminNote,
  docId,
  buttonProps,
  getContacts,
  setAdminNote,
  removeAdminNote,
  methodParams,
  getInsertSchemaOverride,
  getUpdateSchemaOverride,
}) => {
  const [date, setDate] = useState(); // Make sure the date is always up to date, it can get stale if a tab is open for a long time
  const isInsert = !adminNote;

  const { loading, contacts } = getContacts(docId);
  const schema = useMemo(() => {
    const insertSchema = getInsertSchemaOverride || getInsertSchema;
    const updateSchema = getUpdateSchemaOverride || getUpdateSchema;

    return isInsert
      ? insertSchema(contacts.filter(({ isEmailable }) => isEmailable) || [])
      : updateSchema();
  }, [contacts]);

  const searchParams = useSearchParams();

  return (
    <AutoFormDialog
      title={isInsert ? 'Ajouter une note' : 'Modifier note'}
      buttonProps={buttonProps}
      schema={schema}
      openOnMount={!adminNote && searchParams?.addNote}
      onSubmit={({ notifyPros = [], ...values }) =>
        setAdminNote.run({
          ...methodParams,
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
              removeAdminNote
                .run({ ...methodParams, adminNoteId: adminNote.id })
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
      onOpen={() => {
        // Make sure we have local time
        const now = new Date();
        const timezonedDate = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000,
        );

        return setDate(timezonedDate);
      }}
    />
  );
};

export default AdminNoteAdderContainer(AdminNoteSetter);
