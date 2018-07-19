// @flow
import React from 'react';
import { lifecycle } from 'recompose';

type FinancingStructuresLabelProps = {};

const FinancingStructuresLabel = ({
  children,
  height,
}: FinancingStructuresLabelProps) => (
  <span className="label" style={{ height }}>
    {children}
  </span>
);

export default lifecycle({
  componentDidMount() {
    if (this.props.id) {
      // Set height of label field to be as high as the rest of the lines
      const nodes = document.querySelectorAll(`.${this.props.id}`);
      const heights = Array.prototype.slice
        .call(nodes)
        .map(node => node.clientHeight);
      this.setState({ height: Math.max(...heights) });
    }
  },
})(FinancingStructuresLabel);
