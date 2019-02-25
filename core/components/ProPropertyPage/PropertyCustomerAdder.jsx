// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { inviteUserToProperty } from 'core/api/methods';
import { AutoFormDialog } from '../AutoForm2';

type PropertyCustomerAdderProps = {};

const customerSchema = new SimpleSchema({
  email: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, optional: true },
});

const PropertyCustomerAdder = ({ propertyId }: PropertyCustomerAdderProps) => (
  <AutoFormDialog
    schema={customerSchema}
    onSubmit={user => inviteUserToProperty.run({ user, propertyId })}
    buttonProps={{ raised: true, secondary: true, label: 'Ajouter client' }}
    title="Ajouter client"
  />
);

export default PropertyCustomerAdder;
