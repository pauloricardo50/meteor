import React from 'react';

import { T } from 'core/components/Translation';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import CareersPageList from './CareersPageList';

const CareersPage = () => (
  <WwwLayout className="careers-page">
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <section className="careers-page-content">
      <h1>
        <T id="CareersPage.title" />
      </h1>
      <p className="description">
        <T id="CareersPage.description" />
      </p>
      <CareersPageList />
    </section>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default CareersPage;
