// @flow
import React from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';

import type { userLoan } from 'core/api';
import FinancingStructuresLabels from '../FinancingStructuresLabels';
import FinancingStructuresSingleHeader from './FinancingStructuresSingleHeader';
import FinancingStructuresHeaderAdder from './FinancingStructuresHeaderAdder';

type FinancingStructuresHeaderProps = {
  loan: userLoan,
  handleEditTitle: Function,
  handleEditDescription: Function,
};

const FinancingStructuresHeader = ({
  loan: { structures, _id: loanId, selectedStructure },
  handleEditTitle,
  handleEditDescription,
}: FinancingStructuresHeaderProps) => (
  <ScrollSyncPane>
    <div className="financing-structures-section financing-structures-header card1">
      <FinancingStructuresLabels labels={[]} />
      {structures.map((structure, index) => (
        <FinancingStructuresSingleHeader
          structure={structure}
          key={structure.id}
          index={index}
          handleEditTitle={handleEditTitle}
          handleEditDescription={handleEditDescription}
          loanId={loanId}
          selected={selectedStructure === structure.id}
        />
      ))}
      <FinancingStructuresHeaderAdder loanId={loanId} />
    </div>
  </ScrollSyncPane>
);

export default FinancingStructuresHeader;
