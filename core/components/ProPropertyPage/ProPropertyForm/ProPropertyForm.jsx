// @flow
import React from 'react';

import PropertySchema from 'core/api/properties/schemas/PropertySchema';
import { AutoFormDialog } from '../../AutoForm2';

type ProPropertyFormProps = {};

const proPropertySchema = PropertySchema.pick(
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
  'constructionYear',
  'externalUrl',
  'useOpenGraph',
  'imageUrls',
);

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
