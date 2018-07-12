import React from 'react';

import T from 'core/components/Translation';
import PageHead from 'core/components/PageHead';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import WwwInterestRatesTable from './WwwInterestRatesTable';

const InterestsPage = () => (
  <WwwLayout className="interests-page">
    <PageHead
      titleId="InterestsPage.title"
      descriptionId="InterestsPage.description"
    />
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <WwwLayout.Content>
      <section className="interests-page-content">
        <h1>
          <T id="InterestsPage.title" />
        </h1>
        <p className="description">
          <T id="InterestsPage.description" />
        </p>
        <WwwInterestRatesTable />
      </section>
    </WwwLayout.Content>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default InterestsPage;
