import React from 'react';
import { withRouter } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import { proPropertyInsert } from 'core/api';
import { address, moneyField } from 'core/api/helpers/sharedSchemas';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import { AutoFormDialog } from 'core/components/AutoForm2';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import PRO_ROUTES from '../../../startup/client/proRoutes';

export const proPropertySchema = new SimpleSchema({
  address1: String,
  address2: { type: String, optional: true },
  city: String,
  zipCode: address.zipCode,
  value: { ...moneyField, optional: false },
});

const PropertyAdder = ({ history, currentUser: { _id: userId } }) => (
  <AutoFormDialog
    title={<T id="ProDashboardPage.addProperty" />}
    buttonProps={{
      label: <T id="ProDashboardPage.addProperty" />,
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
    }}
    schema={proPropertySchema}
    onSubmit={property =>
      proPropertyInsert
        .run({
          property: { ...property, category: PROPERTY_CATEGORY.PRO },
          userId,
        })
        .then(propertyId =>
          history.push(
            createRoute(PRO_ROUTES.PRO_PROPERTY_PAGE.path, { propertyId }),
          ),
        )
    }
  />
);

export default withRouter(PropertyAdder);
