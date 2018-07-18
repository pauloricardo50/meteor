// @flow
import React from 'react';
import { ScrollSync } from 'react-scroll-sync';

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
  <ScrollSync proportional={false} vertical={false}>
    <div className="financing-structures">
      <FinancingStructuresHeader loan={loan} />
      <FinancingStructuresProject structures={loan.structures} />
      <FinancingStructuresFinancing />
      <FinancingStructuresOwnFunds />
      {/* <FinancingStructuresOffers /> */}
      <FinancingStructuresResult />
    </div>
  </ScrollSync>
);

export default FinancingStructuresContainer(FinancingStructures);
