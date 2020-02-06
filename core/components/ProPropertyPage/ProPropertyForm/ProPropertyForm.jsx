//
import React from 'react';

import PropertySchema from 'core/api/properties/schemas/PropertySchema';
import { AutoFormDialog } from '../../AutoForm2';

const proPropertySchema = PropertySchema.pick(
  'address1',
  'address2',
  'city',
  'zipCode',
  'country',
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
  'constructionYear',
  'externalUrl',
  'useOpenGraph',
  'imageUrls',
);

const ProPropertyForm = ({ model, onSubmit, buttonLabel }) => (
  <AutoFormDialog
    title={buttonLabel}
    buttonProps={{ label: buttonLabel, raised: true, primary: true }}
    model={model}
    schema={proPropertySchema}
    onSubmit={onSubmit}
  />
);

export default ProPropertyForm;
