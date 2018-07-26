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
      .map(({ clientHeight }) => clientHeight);

    // This complains if heights is an empty array, so add 0 by default
    return Math.max(...heights, 0);
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
