// @flow
import React from 'react';

import Financing from 'core/components/Financing';

type FinancingTabProps = {};

const FinancingTab = ({ loan, Calculator }: FinancingTabProps) => (
  <Financing loan={loan} Calculator={Calculator} />
);

export default FinancingTab;
