import React from 'react';

import { insertExternalProperty } from 'core/api/properties/methodDefinitions';
import PropertySchema from 'core/api/properties/schemas/PropertySchema';
import { AutoFormDialog } from 'core/components/AutoForm2';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const schema = PropertySchema.pick(
  'address1',
  'address2',
  'city',
  'zipCode',
  'value',
  'description',
  'propertyType',
  'houseType',
  'flatType',
  'roomCount',
  'insideArea',
  'landArea',
  'terraceArea',
  'gardenArea',
  'cnstructionYear',
  'externalUrl',
  'useOpenGraph',
  'imageUrls',
  'externalId',
);

const ExternalPropertyAdder = props => (
  <AutoFormDialog
    schema={schema}
    onSubmit={property => insertExternalProperty.run({ property })}
    buttonProps={{
      label: <T id="ProDashboardPage.ExternalPropertyAdder" />,
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
    }}
  />
);

export default ExternalPropertyAdder;
