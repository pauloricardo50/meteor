import React from 'react';

import PropertySchema from '../../../api/properties/schemas/PropertySchema';
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

const ProPropertyForm = ({ model, onSubmit, buttonProps }) => (
  <AutoFormDialog
    buttonProps={{ raised: true, primary: true, ...buttonProps }}
    model={model}
    schema={proPropertySchema}
    onSubmit={onSubmit}
  />
);

export default ProPropertyForm;
