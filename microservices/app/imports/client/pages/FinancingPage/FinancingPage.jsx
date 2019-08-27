// @flow
import React from 'react';

import PageHead from 'core/components/PageHead';
import Financing from 'core/components/Financing';
import { withCalculator } from 'core/containers/withCalculator';
import type { userLoan } from 'core/api';
import PageApp from '../../components/PageApp';
import ReturnToDashboard from '../../components/ReturnToDashboard';

type FinancingPageProps = {
  loan: userLoan,
  Calculator: Class,
};

const FinancingPage = ({ loan, Calculator }: FinancingPageProps) => (
  <PageApp id="FinancingPage" fullWidth>
    <PageHead titleId="FinancingPage" />
    <Financing loan={loan} Calculator={Calculator} />
    <ReturnToDashboard />
  </PageApp>
);

export default withCalculator(FinancingPage);
