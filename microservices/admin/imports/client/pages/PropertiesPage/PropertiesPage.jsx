// @flow
import React from 'react';

import T from 'core/components/Translation';
import PropertiesTable from './PropertiesTable';

const Propertiespage = () => (
  <section className="card1 card-top properties-page">
    <h1>
      <T id="collections.properties" />
    </h1>
    <PropertiesTable />
  </section>
);

export default Propertiespage;
