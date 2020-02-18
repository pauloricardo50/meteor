import React from 'react';

import PageHead from 'core/components/PageHead';
import Financing from 'core/components/Financing';
import { withCalculator } from 'core/containers/withCalculator';

import PageApp from '../../components/PageApp';
import ReturnToDashboard from '../../components/ReturnToDashboard';

const FinancingPage = ({ loan, Calculator }) => (
  <PageApp id="FinancingPage" fullWidth>
    <PageHead titleId="FinancingPage" />
    <Financing loan={loan} Calculator={Calculator} />
    <ReturnToDashboard />
  </PageApp>
);

export default withCalculator(FinancingPage);
