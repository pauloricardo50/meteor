// @flow
import React from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';

import type { userLoan } from 'core/api';
import FinancingLabels from '../FinancingLabels';
import FinancingSingleHeader from './FinancingSingleHeader';
import FinancingHeaderAdder from './FinancingHeaderAdder';
import FinancingDataContainer from '../containers/FinancingDataContainer';

type FinancingHeaderProps = {
  selectedStructure: string,
  loan: userLoan,
  handleEditTitle: Function,
  handleEditDescription: Function,
};

const FinancingHeader = ({
  selectedStructure,
  loan,
  handleEditTitle,
  handleEditDescription,
}: FinancingHeaderProps) => {
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
