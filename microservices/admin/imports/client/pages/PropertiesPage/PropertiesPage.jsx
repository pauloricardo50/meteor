import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

import {
  PROPERTIES_COLLECTION,
  PROPERTY_CATEGORY,
} from 'core/api/properties/propertyConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import { PropertyAdder } from 'core/components/PropertyForm';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import PropertiesTable from './PropertiesTable';

const Propertiespage = ({ history }) => (
  <section className="properties-page">
    <Helmet>
      <title>Biens immobiliers</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[PROPERTIES_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="collections.properties" />
    </h1>
    <PropertyAdder
      category={PROPERTY_CATEGORY.PRO}
      buttonProps={{ label: 'Bien immo Pro', icon: <Icon type="add" /> }}
      onSubmitSuccess={propertyId =>
        history.push(
          createRoute(ADMIN_ROUTES.SINGLE_PROPERTY_PAGE.path, { propertyId }),
        )
      }
    />
    <PropertiesTable />
  </section>
);

export default withRouter(Propertiespage);
