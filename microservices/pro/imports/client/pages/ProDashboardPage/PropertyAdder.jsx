// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { propertyInsert } from 'core/api';
import { createRoute } from 'core/utils/routerUtils';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import { moneyField, address } from 'core/api/helpers/sharedSchemas';
import { PRO_PROPERTY_PAGE } from '../../../startup/client/proRoutes';

type PropertyAdderProps = {};

export const proPropertySchema = new SimpleSchema({
  address1: String,
  address2: { type: String, optional: true },
  city: String,
  zipCode: address.zipCode,
  value: { ...moneyField, optional: false },
});

const PropertyAdder = ({ history }: PropertyAdderProps) => (
  <AutoFormDialog
    title={<T id="ProDashboardPage.addProperty" />}
    buttonProps={{
      label: <T id="ProDashboardPage.addProperty" />,
      raised: true,
      primary: true,
    }}
    schema={proPropertySchema}
    onSubmit={property =>
      propertyInsert
        .run({ property: { ...property, category: PROPERTY_CATEGORY.PRO } })
        .then(propertyId =>
          history.push(createRoute(PRO_PROPERTY_PAGE, { propertyId })))
    }
  />
);

export default withRouter(PropertyAdder);
