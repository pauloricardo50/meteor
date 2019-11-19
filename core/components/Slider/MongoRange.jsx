// @flow
import React from 'react';

import Range from './Range';

type MongoRangeProps = {};

const MongoRange = ({
  value: { $lte, $gte },
  onChange,
  ...rest
}: MongoRangeProps) => (
  <Range
    value={[$gte, $lte]}
    onChange={([low, high]) => onChange({ $gte: low, $lte: high })}
    {...rest}
  />
);

export default MongoRange;
