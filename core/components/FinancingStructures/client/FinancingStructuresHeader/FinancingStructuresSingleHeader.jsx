// @flow
import React from 'react';

type FinancingStructuresSingleHeaderProps = {};

const FinancingStructuresSingleHeader = ({
  structure,
  index,
}: FinancingStructuresSingleHeaderProps) => (
  <div className="financing-structures-single-header structure">
    {structure.name || `Structure ${index + 1}`}
  </div>
);

export default FinancingStructuresSingleHeader;
