import React from 'react';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import CareersPageList from './CareersPageList';

const CareersPage = () => (
  <WwwLayout className="careers-page">
    <PageHead
      titleId="CareersPage.title"
      descriptionId="CareersPage.description1"
    />
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <section className="careers-page-content">
      <h1>
        <T id="CareersPage.title" />
      </h1>
      <p className="description">
        <T id="CareersPage.description1" />
        <br />
        <br />
        <T id="CareersPage.description2" />
      </p>
      <CareersPageList />
    </section>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default CareersPage;
