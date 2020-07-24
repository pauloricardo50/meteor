import React from 'react';

import PropertySchema from '../../../api/properties/schemas/PropertySchema';
import { AutoFormDialog } from '../../AutoForm2';
import Box from '../../Box';

export const proPropertyFormFields = {
  address1: 1,
  address2: 1,
  balconyArea: 1,
  city: 1,
  constructionYear: 1,
  country: 1,
  description: 1,
  externalUrl: 1,
  flatType: 1,
  gardenArea: 1,
  houseType: 1,
  imageUrls: 1,
  insideArea: 1,
  landArea: 1,
  propertyType: 1,
  roomCount: 1,
  terraceArea: 1,
  useOpenGraph: 1,
  value: 1,
  zipCode: 1,
};

const proPropertySchema = PropertySchema.pick(
  ...Object.keys(proPropertyFormFields),
);

const proPropertyFormlayout = [
  'description',
  { fields: ['value', 'propertyType'], className: 'grid-col mb-16' },
  {
    Component: Box,
    title: <h5>Adresse</h5>,
    layout: [
      { fields: ['address1', 'address2'], className: 'grid-2' },
      { className: 'grid-col', fields: ['zipCode', 'city', 'country'] },
    ],
    className: 'mb-16',
  },
  {
    Component: Box,
    title: <h5>Détails</h5>,
    layout: [
      { fields: ['roomCount', 'constructionYear'], className: 'grid-2' },
      { fields: ['houseType', 'flatType'], className: 'grid-2' },
      {
        fields: ['insideArea', 'landArea'],
        className: 'grid-2',
      },
      {
        fields: ['terraceArea', 'gardenArea', 'balconyArea'],
        className: 'grid-col',
      },
      'externalUrl',
      'imageUrls',
    ],
  },
  '__REST',
];

const ProPropertyForm = ({ model, onSubmit, buttonProps, ...rest }) => (
  <AutoFormDialog
    buttonProps={{ raised: true, primary: true, ...buttonProps }}
    model={model}
    schema={proPropertySchema}
    onSubmit={onSubmit}
    layout={proPropertyFormlayout}
    {...rest}
  />
);

export default ProPropertyForm;
