// @flow
import React from 'react';
import { AutoFormDialog } from 'core/components/AutoForm2';
import ProCustomerAdderContainer from './ProCustomerAdderContainer';

type ProCustomerAdderProps = {};

const ProCustomerAdder = ({ schema, onSubmit }: ProCustomerAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={onSubmit}
    title="Inviter un client"
    buttonProps={{
      raised: true,
      secondary: true,
      label: 'Inviter un client',
    }}
  />
);

export default ProCustomerAdderContainer(ProCustomerAdder);
