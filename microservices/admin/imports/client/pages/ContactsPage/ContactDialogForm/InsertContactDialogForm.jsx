import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
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
      label: 'Contact',
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
    }}
    title={<T id="Contacts.insert" />}
    openOnMount={openOnMount}
  />
);

export default ContactDialogFormContainer(InsertContactDialogForm);
