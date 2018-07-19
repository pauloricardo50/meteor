// @flow
import React from 'react';

import FinancingStructuresLabel from './FinancingStructuresLabel';

type FinancingStructureLabelsProps = {
  config: Array<{ id: string, label: React.Node }>,
};

const FinancingStructuresLabels = ({
  config,
}: FinancingStructureLabelsProps) => (
  <div className="financing-structures-labels">
    {config.map(({ id, label }) => (
      <FinancingStructuresLabel id={id} key={label}>
        {label || id}
      </FinancingStructuresLabel>
    ))}
  </div>
);

export default FinancingStructuresLabels;
