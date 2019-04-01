// @flow
import React from 'react';

import { insertExternalProperty } from 'core/api/methods';
import { AutoFormDialog } from 'core/components/AutoForm2';
import PropertySchema from 'core/api/properties/schemas/PropertySchema';
import T from 'core/components/Translation';

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
      label: <T id="ProDashboardPage.ExternalPropertyAdder" />,
      raised: true,
      primary: true,
    }}
  />
);

export default ExternalPropertyAdder;
