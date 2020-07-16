import React from 'react';

import PropertySchema from '../../../api/properties/schemas/PropertySchema';
import { AutoFormDialog } from '../../AutoForm2';

export const proPropertyFormFields = {
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
  country: 1,
  value: 1,
  description: 1,
  propertyType: 1,
  houseType: 1,
  flatType: 1,
  roomCount: 1,
  insideArea: 1,
  landArea: 1,
  terraceArea: 1,
  gardenArea: 1,
  balconyArea: 1,
  constructionYear: 1,
  externalUrl: 1,
  useOpenGraph: 1,
  imageUrls: 1,
};

const proPropertySchema = PropertySchema.pick(
  ...Object.keys(proPropertyFormFields),
);

const ProPropertyForm = ({ model, onSubmit, buttonProps, ...rest }) => (
  <AutoFormDialog
    buttonProps={{ raised: true, primary: true, ...buttonProps }}
    model={model}
    schema={proPropertySchema}
    onSubmit={onSubmit}
    {...rest}
  />
);

export default ProPropertyForm;
