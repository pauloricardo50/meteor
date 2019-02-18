// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { moneyField, address } from '../../../api/helpers/sharedSchemas';
import { AutoFormDialog } from '../../AutoForm2';

type ProPropertyFormProps = {};

const proPropertySchema = new SimpleSchema({
  address1: String,
  address2: { type: String, optional: true },
  city: String,
  zipCode: address.zipCode,
  value: { ...moneyField, optional: false },
  description: {
    type: String,
    optional: true,
    uniforms: {
      multiline: true,
      rows: 5,
      rowsMax: 15,
      // style: { width: '500px' },
    },
  },
});

const ProPropertyForm = ({
  model,
  onSubmit,
  buttonLabel,
}: ProPropertyFormProps) => (
  <AutoFormDialog
    title={buttonLabel}
    buttonProps={{ label: buttonLabel, raised: true, primary: true }}
    model={model}
    schema={proPropertySchema}
    onSubmit={onSubmit}
  />
);

export default ProPropertyForm;
