import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';

import ContactDialogFormContainer from './ContactDialogFormContainer';

const getOrganisationWithSameAddress = ({ organisations = [] }) => {
  const { _id: organisationId } =
    organisations.find(({ $metadata }) => $metadata.useSameAddress) || {};
  return organisationId || null;
};

const ModifyContactDialogForm = ({
  contact,
  removeContact,
  modifyContact,
  schema,
}) => (
  <AutoFormDialog
    schema={schema}
    model={{
      ...contact,
      useSameAddress: getOrganisationWithSameAddress(contact),
    }}
    onSubmit={modifyContact}
    buttonProps={{
      label: <T id="Contacts.modify" />,
      raised: true,
      primary: true,
    }}
    onDelete={() => removeContact(contact._id)}
  />
);

export default ContactDialogFormContainer(ModifyContactDialogForm);
