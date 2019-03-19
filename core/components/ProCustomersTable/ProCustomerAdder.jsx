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
    description={(
      <p className="description">
        Ajoute un compte pour ce client, et le notifiera par email que vous
        l'avez invité sur e-Potek. Si c'est un client déjà existant chez
        e-Potek, vous devez l'inviter à une promotion ou à un bien immobilier.
      </p>
    )}
    buttonProps={{
      raised: true,
      secondary: true,
      label: 'Inviter un client',
    }}
  />
);

export default ProCustomerAdderContainer(ProCustomerAdder);
