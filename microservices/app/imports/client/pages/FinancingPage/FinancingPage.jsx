// @flow
import React from 'react';

import PageHead from 'core/components/PageHead';
import Financing from 'core/components/Financing';
import type { userLoan } from 'core/api';
import PageApp from '../../components/PageApp';
import ReturnToDashboard from '../../components/ReturnToDashboard';

type FinancingPageProps = {
  loan: userLoan,
};

const FinancingPage = ({ loan }: FinancingPageProps) => (
  <PageApp id="FinancingPage" fullWidth>
    <PageHead titleId="FinancingPage" />
    <Financing loan={loan} />
    <ReturnToDashboard />
  </PageApp>
);

export default FinancingPage;
