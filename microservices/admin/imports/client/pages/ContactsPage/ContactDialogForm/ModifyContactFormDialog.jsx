// @flow
import React from 'react';
import AutoFormDialog from 'imports/core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation/';
import ContactDialogFormContainer from './ContactDialogFormContainer';

type ModifyContactDialogFormProps = {
  schema: Object,
  modifyContact: Function,
  contact: Object,
};

const ModifyContactDialogForm = ({
  schema,
  modifyContact,
  contact,
}: ModifyContactDialogFormProps) => (
  <AutoFormDialog
    schema={schema}
    model={contact}
    onSubmit={modifyContact}
    buttonProps={{
      label: <T id="Contacts.modify" />,
      raised: true,
      primary: true,
    }}
  />
);

export default ContactDialogFormContainer(ModifyContactDialogForm);
