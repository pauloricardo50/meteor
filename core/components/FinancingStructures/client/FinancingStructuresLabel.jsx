// @flow
import React, { Component } from 'react';

type FinancingStructuresLabelProps = {
  children: React.Node,
  id?: string,
};
type FinancingStructuresLabelState = {
  height: number,
};

export default class FinancingStructuresLabel extends Component<
  FinancingStructuresLabelProps,
  FinancingStructuresLabelState,
> {
  constructor(props) {
    super(props);
    this.state = { height: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const height = this.getLabelHeight();
      this.setState({ height });

      if (height) {
        clearInterval(this.interval);
      }
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getLabelHeight = () => {
    const { id } = this.props;
    if (id) {
      // Set height of label field to be as high as the rest of the lines
      const nodes = document.querySelectorAll(`.${id}`);
      const heights = Array.prototype.slice
        .call(nodes)
        .map(({ clientHeight }) => clientHeight);

      // This complains if heights is an empty array, so add 0 by default
      return Math.max(...heights, 0);
    }
    return 0;
  };

  render() {
    const { height } = this.state;
    const { children } = this.props;

    return (
      <span className="label" style={{ height }}>
        {children}
      </span>
    );
  }
}
