// @flow
import React from 'react';

import PageHead from 'core/components/PageHead';
import FinancingStructures from 'core/components/FinancingStructures';
import type { userLoan } from 'core/api';

type FinancingPageProps = {
  loan: userLoan,
};

const FinancingPage = ({ loan }: FinancingPageProps) => (
  <section>
    <PageHead titleId="FinancingPage.title" />
    <FinancingStructures loan={loan} />
  </section>
);

export default FinancingPage;
