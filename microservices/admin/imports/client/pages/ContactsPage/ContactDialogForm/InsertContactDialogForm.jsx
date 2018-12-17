// @flow
import React from 'react';
import AutoFormDialog from 'imports/core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation/';
import ContactDialogFormContainer from './ContactDialogFormContainer';

type InsertContactDialogFormProps = {
  schema: Object,
  insertContact: Function,
};

const InsertContactDialogForm = ({
  schema,
  insertContact,
}: InsertContactDialogFormProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertContact}
    buttonProps={{
      label: <T id="Contacts.insert" />,
      raised: true,
      primary: true,
    }}
  />
);

export default ContactDialogFormContainer(InsertContactDialogForm);
