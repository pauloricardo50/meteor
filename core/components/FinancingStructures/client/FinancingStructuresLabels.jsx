// @flow
import React from 'react';

type FinancingStructureLabelsProps = {
  labels: Array<string>,
};

const FinancingStructuresLabels = ({
  labels,
}: FinancingStructureLabelsProps) => (
  <div className="financing-structures-labels">
    {labels.map(label => (
      <span className="label" key={label}>
        {label}
      </span>
    ))}
  </div>
);

export default FinancingStructuresLabels;
