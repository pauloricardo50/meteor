// @flow
import React from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';

import type { userLoan } from 'core/api';
import FinancingStructuresLabels from '../FinancingStructuresLabels';
import FinancingStructuresSingleHeader from './FinancingStructuresSingleHeader';
import FinancingStructuresHeaderAdder from './FinancingStructuresHeaderAdder';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';

type FinancingStructuresHeaderProps = {
  selectedStructure: string,
  loan: userLoan,
  handleEditTitle: Function,
  handleEditDescription: Function,
};

const FinancingStructuresHeader = ({
  selectedStructure,
  loan: { structures, _id: loanId },
  handleEditTitle,
  handleEditDescription,
}: FinancingStructuresHeaderProps) => (
  <ScrollSyncPane>
    <div className="card1 financing-structures-section financing-structures-header">
      <FinancingStructuresLabels
        config={[
          { label: () => <FinancingStructuresHeaderAdder loanId={loanId} /> },
        ]}
      />
      {structures.map((structure, index) => (
        <FinancingStructuresSingleHeader
          structureId={structure.id}
          key={structure.id}
          index={index}
          handleEditTitle={handleEditTitle}
          handleEditDescription={handleEditDescription}
          loanId={loanId}
          selected={selectedStructure === structure.id}
        />
      ))}
    </div>
  </ScrollSyncPane>
);

export default FinancingStructuresDataContainer()(FinancingStructuresHeader);
