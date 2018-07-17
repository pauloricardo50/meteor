// @flow
import React from 'react';

import type { userLoan } from 'core/api';
import FinancingStructuresFinancing from './FinancingStructuresFinancing';
import FinancingStructuresHeader from './FinancingStructuresHeader';
import FinancingStructuresOffers from './FinancingStructuresOffers';
import FinancingStructuresOwnFunds from './FinancingStructuresOwnFunds';
import FinancingStructuresProject from './FinancingStructuresProject';
import FinancingStructuresResult from './FinancingStructuresResult';
import FinancingStructuresContainer from './FinancingStructuresContainer';

type FinancingStructuresProps = {
  loan: userLoan,
};

const FinancingStructures = ({ loan }: FinancingStructuresProps) => (
  <div className="financing-structures">
    <FinancingStructuresHeader loan={loan} />
    <FinancingStructuresProject />
    <FinancingStructuresFinancing />
    <FinancingStructuresOwnFunds />
    <FinancingStructuresOffers />
    <FinancingStructuresResult />
  </div>
);

export default FinancingStructuresContainer(FinancingStructures);
