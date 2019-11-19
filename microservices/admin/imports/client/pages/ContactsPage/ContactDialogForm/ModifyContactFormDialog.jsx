// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import ContactDialogFormContainer from './ContactDialogFormContainer';

type ModifyContactDialogFormProps = {
  contact: Object,
  removeContact: Function,
  modifyContact: Function,
  schema: Object,
};

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
}: ModifyContactDialogFormProps) => (
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
    renderAdditionalActions={({ closeDialog, setDisableActions }) => (
      <Button
        onClick={() => {
          setDisableActions(true);
          return removeContact(contact._id)
            .then(closeDialog)
            .finally(() => setDisableActions(false));
        }}
        error
      >
        <T id="general.delete" />
      </Button>
    )}
  />
);

export default ContactDialogFormContainer(ModifyContactDialogForm);
