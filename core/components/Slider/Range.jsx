// @flow
import React from 'react';

import Slider from './Slider';

type RangeProps = {};

const Range = ({ defaultValue = [0], ...rest }: RangeProps) => (
  <Slider defaultValue={defaultValue} {...rest} />
);

export default Range;
