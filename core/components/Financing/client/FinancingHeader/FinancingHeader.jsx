import React from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';

import FinancingDataContainer from '../containers/FinancingDataContainer';
import FinancingLabels from '../FinancingLabels';
import FinancingHeaderAdder from './FinancingHeaderAdder';
import FinancingSingleHeader from './FinancingSingleHeader';

const FinancingHeader = ({
  selectedStructure,
  loan,
  handleEditTitle,
  handleEditDescription,
}) => {
  const { structures, _id: loanId } = loan;
  return (
    <ScrollSyncPane>
      <div className="card1 financing-structures-section financing-structures-header">
        <FinancingLabels
          config={[
            {
              label: () => <FinancingHeaderAdder loan={loan} />,
            },
          ]}
        />
        {structures.map((structure, index) => (
          <FinancingSingleHeader
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
};

export default FinancingDataContainer(FinancingHeader);
