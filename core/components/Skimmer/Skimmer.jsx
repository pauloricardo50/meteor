// @flow
import React from 'react';
import { compose, withProps, withState } from 'recompose';

type SkimmerProps = {};

const element = React.createRef();

const Skimmer = ({ onMouseMove, toDisplay, ...props }: SkimmerProps) => (
  <div ref={element} onMouseMove={onMouseMove} {...props}>
    {toDisplay}
  </div>
);

const getElementToDisplay = (data, xPos) => {
  const elementWidth = element.current && element.current.clientWidth;

  if (!data || data.length === 0) {
    return null;
  }

  if (!elementWidth || !xPos) {
    return data[0];
  }

  const trancheWidth = elementWidth / data.length;
  const trancheIndex = Math.floor(xPos / trancheWidth);

  return data[trancheIndex];
};

export default compose(
  withState('xPos', 'setX', 0),
  withProps(({ setX, data, xPos }) => ({
    onMouseMove: event => setX(event.pageX - element.current.offsetLeft),
    toDisplay: getElementToDisplay(data, xPos),
  })),
)(Skimmer);
