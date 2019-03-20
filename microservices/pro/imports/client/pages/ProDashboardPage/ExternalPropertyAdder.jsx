// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { insertExternalProperty } from 'core/api/methods';
import { AutoFormDialog } from 'core/components/AutoForm2';
import PropertySchema from 'core/api/properties/schemas/PropertySchema';

const schema = PropertySchema.pick(
  'address1',
  'city',
  'zipCode',
  'value',
  'externalUrl',
  'imageUrls',
  'externalId',
  'useOpenGraph',
);

type ExternalPropertyAdderProps = {};

const ExternalPropertyAdder = (props: ExternalPropertyAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={property => insertExternalProperty.run({ property })}
    buttonProps={{
      label: 'Ajouter bien immo API',
      raised: true,
      primary: true,
    }}
  />
);

export default ExternalPropertyAdder;
