// @flow
import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import { PROPERTIES_COLLECTION, PROPERTY_CATEGORY } from 'core/api/constants';
import { PropertyAdder } from 'core/components/PropertyForm';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import PropertiesTable from './PropertiesTable';

const Propertiespage = ({ history }) => (
  <section className="card1 card-top properties-page">
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
      buttonLabelId="PropertiesPage.addProProperty"
      onSubmitSuccess={propertyId =>
        history.push(createRoute(ADMIN_ROUTES.SINGLE_PROPERTY_PAGE.path, { propertyId }))
      }
    />
    <PropertiesTable />
  </section>
);

export default withRouter(Propertiespage);
