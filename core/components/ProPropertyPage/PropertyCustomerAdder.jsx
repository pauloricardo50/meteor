// @flow
import React from 'react';

import { inviteUserToProperty } from 'core/api/methods';
import { AutoFormDialog } from '../AutoForm2';
import { CustomerAdderUserSchema } from '../PromotionPage/client/CustomerAdder/CustomerAdder';

type PropertyCustomerAdderProps = {};

const PropertyCustomerAdder = ({ propertyId }: PropertyCustomerAdderProps) => (
  <AutoFormDialog
    schema={CustomerAdderUserSchema}
    onSubmit={user => inviteUserToProperty.run({ user, propertyId })}
    buttonProps={{ raised: true, secondary: true, label: 'Ajouter client' }}
    title="Ajouter client"
  />
);

export default PropertyCustomerAdder;
