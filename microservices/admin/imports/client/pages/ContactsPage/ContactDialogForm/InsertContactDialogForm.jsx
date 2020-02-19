import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import ContactDialogFormContainer from './ContactDialogFormContainer';

const InsertContactDialogForm = ({
  schema,
  insertContact,
  model,
  openOnMount,
}) => (
  <AutoFormDialog
    schema={schema}
    model={model}
    onSubmit={insertContact}
    buttonProps={{
      label: <T id="Contacts.insert" />,
      raised: true,
      primary: true,
    }}
    title={<T id="Contacts.insert" />}
    openOnMount={openOnMount}
  />
);

export default ContactDialogFormContainer(InsertContactDialogForm);
