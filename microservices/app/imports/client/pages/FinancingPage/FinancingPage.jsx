// @flow
import React from 'react';

import PageHead from 'core/components/PageHead';
import FinancingStructures from 'core/components/FinancingStructures';
import type { userLoan } from 'core/api';
import ReturnToDashboard from '../../components/ReturnToDashboard';

type FinancingPageProps = {
  loan: userLoan,
};

const FinancingPage = ({ loan }: FinancingPageProps) => (
  <section className="animated fadeIn">
    <PageHead titleId="FinancingPage" />
    <FinancingStructures loan={loan} />
    <ReturnToDashboard />
  </section>
);

export default FinancingPage;
