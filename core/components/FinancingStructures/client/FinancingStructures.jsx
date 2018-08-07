// @flow
import React from 'react';
import { ScrollSync } from 'react-scroll-sync';

import type { userLoan } from 'core/api';
import Loading from '../../Loading';
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

const FinancingStructures = ({
  loan: { structures },
}: FinancingStructuresProps) =>
  (structures.length > 0 ? (
    <ScrollSync proportional={false} vertical={false}>
      <div className="financing-structures">
        <FinancingStructuresHeader />
        <FinancingStructuresProject />
        <FinancingStructuresFinancing />
        <FinancingStructuresOwnFunds />
        {/* <FinancingStructuresOffers /> */}
        <FinancingStructuresResult />
      </div>
    </ScrollSync>
  ) : (
    <Loading />
  ));

export default FinancingStructuresContainer(FinancingStructures);
