// @flow
import React, { Component } from 'react';

type SkimmerProps = {
  data: Array<any>,
};
type SkimmerState = {
  xPos: number,
};

export default class Skimmer extends Component<SkimmerProps, SkimmerState> {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = { xPos: 0 };
  }

  setX = event =>
    this.setState({ xPos: event.pageX - this.ref.current.offsetLeft });

  getElementToDisplay = (data, xPos, ref) => {
    if (!ref.current || !data || data.length === 0) {
      if (!ref.current) {
        // Sometimes the ref is undefined on re-render. because we're
        // accessing ref.current in the render method (which is not great)
        // Simply re-render to have ref.current set on the next update
        this.forceUpdate();
      }
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

  render() {
    const { data } = this.props;
    const { xPos } = this.state;
    return (
      <div ref={this.ref} onMouseMove={this.setX} {...this.props}>
        {this.getElementToDisplay(data, xPos, this.ref)}
      </div>
    );
  }
}
