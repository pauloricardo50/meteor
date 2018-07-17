// @flow
import React from 'react';

import type { userLoan } from 'core/api';
import FinancingStructuresLabels from '../FinancingStructuresLabels';
import FinancingStructuresSingleHeader from './FinancingStructuresSingleHeader';
import FinancingStructuresHeaderAdder from './FinancingStructuresHeaderAdder';

type FinancingStructuresHeaderProps = { loan: userLoan };

const FinancingStructuresHeader = ({
  loan: { structures, _id: loanId },
}: FinancingStructuresHeaderProps) => (
  <div className="financing-structures-section financing-structures-header card1">
    <FinancingStructuresLabels labels={[]} />
    {structures.map((structure, index) => (
      <FinancingStructuresSingleHeader
        structure={structure}
        key={structure.id}
        index={index}
      />
    ))}
    <FinancingStructuresHeaderAdder loanId={loanId} />
  </div>
);

export default FinancingStructuresHeader;
