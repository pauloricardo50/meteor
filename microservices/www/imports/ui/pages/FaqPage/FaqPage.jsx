import React from 'react';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import FaqPageList from './FaqPageList';

const FaqPage = () => (
  <WwwLayout className="faq-page">
    <PageHead titleId="FaqPage.title" descriptionId="FaqPage.description" />
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <div className="faq-page-content">
      <h1>
        <T id="FaqPage.title" />
      </h1>
      <p className="description">
        <T id="FaqPage.description" />
      </p>
      <FaqPageList />
    </div>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default FaqPage;
