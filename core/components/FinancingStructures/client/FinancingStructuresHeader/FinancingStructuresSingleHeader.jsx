// @flow
import React from 'react';

import ClickToEditField from '../../../ClickToEditField';
import FinancingStructuresSingleHeaderContainer from './FinancingStructuresSingleHeaderContainer';

type FinancingStructuresSingleHeaderProps = {
  structure: {},
  index: number,
  handleEditTitle: Function,
  handleEditDescription: Function,
};

const FinancingStructuresSingleHeader = ({
  structure,
  index,
  handleEditTitle,
  handleEditDescription,
}: FinancingStructuresSingleHeaderProps) => (
  <div className="financing-structures-single-header structure">
    <h3>
      <ClickToEditField
        value={structure.name}
        placeholder={`Structure ${index + 1}`}
        onSubmit={handleEditTitle}
      />
    </h3>

    <span className="secondary">
      <ClickToEditField
        value={structure.description}
        placeholder="Description"
        onSubmit={handleEditDescription}
      />
    </span>
  </div>
);

export default FinancingStructuresSingleHeaderContainer(FinancingStructuresSingleHeader);
