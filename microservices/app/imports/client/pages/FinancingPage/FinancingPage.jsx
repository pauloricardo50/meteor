// @flow
import React from 'react';

import PageHead from 'core/components/PageHead';
import Financing from 'core/components/Financing';
import type { userLoan } from 'core/api';
import ReturnToDashboard from '../../components/ReturnToDashboard';
import Page from '../../components/Page';

type FinancingPageProps = {
  loan: userLoan,
};

const FinancingPage = ({ loan }: FinancingPageProps) => (
  <Page id="FinancingPage" fullWidth>
    <PageHead titleId="FinancingPage" />
    <Financing loan={loan} />
    <ReturnToDashboard />
  </Page>
);

export default FinancingPage;
