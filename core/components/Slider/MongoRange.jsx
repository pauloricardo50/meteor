//
import React from 'react';

import Range from './Range';

const MongoRange = ({ value: { $lte, $gte }, onChange, ...rest }) => (
  <Range
    value={[$gte, $lte]}
    onChange={([low, high]) => onChange({ $gte: low, $lte: high })}
    {...rest}
  />
);

export default MongoRange;
