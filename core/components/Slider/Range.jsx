//
import React from 'react';

import Slider from './Slider';

const Range = ({ defaultValue = [0], ...rest }) => (
  <Slider defaultValue={defaultValue} {...rest} />
);

export default Range;
