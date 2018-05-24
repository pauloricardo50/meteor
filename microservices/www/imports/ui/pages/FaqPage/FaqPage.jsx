import React from 'react';

import { T } from 'core/components/Translation';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import FaqPageList from './FaqPageList';

const FaqPage = () => (
  <WwwLayout className="faq-page">
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <div className="faq-page-content">
      <h1>
        <T id="FaqPage.title" />
      </h1>
      <FaqPageList />
    </div>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default FaqPage;
