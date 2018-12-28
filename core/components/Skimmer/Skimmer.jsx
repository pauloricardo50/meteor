// @flow
import React, { Component } from 'react';

type SkimmerProps = {
  data: Array<any>,
};
type SkimmerState = {
  xPos: number,
};

const getElementToDisplay = (data, xPos, ref) => {
  if (!ref.current || !data || data.length === 0) {
    return null;
  }

  const { clientWidth } = ref.current;

  if (!clientWidth || !xPos) {
    return data[0];
  }

  const trancheWidth = clientWidth / data.length;
  const trancheIndex = Math.floor(xPos / trancheWidth);

  // When trancheIndex goes out of bounds, usually at the edges, simply
  // return the first data point
  if (trancheIndex < 0 || trancheIndex >= data.length) {
    return data[0];
  }

  return data[trancheIndex];
};

export default class Skimmer extends Component<SkimmerProps, SkimmerState> {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { xPos: 0 };
  }

  setX = event =>
    this.setState({ xPos: event.pageX - this.ref.current.offsetLeft });

  render() {
    const { data } = this.props;
    const { xPos } = this.state;
    return (
      <div ref={this.ref} onMouseMove={this.setX} {...this.props}>
        {getElementToDisplay(data, xPos, this.ref)}
      </div>
    );
  }
}
