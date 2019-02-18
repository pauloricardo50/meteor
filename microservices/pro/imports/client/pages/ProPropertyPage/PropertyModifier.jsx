// @flow
import React from 'react';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { propertyUpdate } from 'core/api/methods';
import { proPropertySchema } from '../ProDashboardPage/PropertyAdder';

type PropertyModifierProps = {};

const PropertyModifier = ({ property }: PropertyModifierProps) => (
  <AutoFormDialog
    buttonProps={{
      raised: true,
      primary: true,
      label: <T id="general.modify" />,
    }}
    schema={proPropertySchema}
    model={property}
    onSubmit={object =>
      propertyUpdate.run({ propertyId: property._id, object })
    }
  />
);

export default PropertyModifier;
