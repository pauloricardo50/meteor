import React from 'react';

import T from 'core/components/Translation';
import WwwLayout from '../../WwwLayout';
import { VARIANTS } from '../../WwwLayout/WwwTopNav';
import InterestsTable from './InterestsTable';

const InterestsPage = () => (
  <WwwLayout className="interests-page">
    <WwwLayout.TopNav variant={VARIANTS.GREY} />
    <main className="www-main">
      <section className="interests-page-content">
        <h1>
          <T id="InterestsPage.title" />
        </h1>
        <p className="description">
          <T id="InterestsPage.description" />
        </p>
        <InterestsTable />
      </section>
    </main>
    <WwwLayout.Footer />
  </WwwLayout>
);

export default InterestsPage;