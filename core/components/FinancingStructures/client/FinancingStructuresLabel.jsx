// @flow
import React from 'react';

type FinancingStructuresLabelProps = {
  children: React.Node,
  id?: string,
};

const getLabelHeight = (id) => {
  if (id) {
    // Set height of label field to be as high as the rest of the lines
    const nodes = document.querySelectorAll(`.${id}`);
    const heights = Array.prototype.slice
      .call(nodes)
      .map(node => node.clientHeight);
    return Math.max(...heights);
  }
};

const FinancingStructuresLabel = ({
  children,
  id,
}: FinancingStructuresLabelProps) => {
  const height = getLabelHeight(id);
  return (
    <span className="label" style={{ height }}>
      {children}
    </span>
  );
};

export default FinancingStructuresLabel;
