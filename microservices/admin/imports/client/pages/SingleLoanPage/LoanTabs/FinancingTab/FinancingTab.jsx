// @flow
import React from 'react';

import Financing from 'core/components/Financing';

type FinancingTabProps = {};

const FinancingTab = ({ loan }: FinancingTabProps) => (
  <Financing loan={loan} />
);
export default FinancingTab;
