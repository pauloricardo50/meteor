// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import { PROPERTIES_COLLECTION } from 'core/api/constants';
import PropertiesTable from './PropertiesTable';

const Propertiespage = () => (
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
    <PropertiesTable />
  </section>
);

export default Propertiespage;
