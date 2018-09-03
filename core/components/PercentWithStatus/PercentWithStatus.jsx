// @flow
import React from 'react';

import { Percent } from '../Translation';
import StatusIcon from '../StatusIcon';
import { SUCCESS, ERROR } from '../../api/constants';

type PercentWithStatusProps = {
  value: number,
  status?: string,
};

const PercentWithStatus = ({
  value,
  status = value >= 1 ? SUCCESS : ERROR,
}: PercentWithStatusProps) => (
  <React.Fragment>
    {Number.isNaN(value) ? '-' : <Percent value={value} />}
    {!Number.isNaN(value) && (
      <StatusIcon status={status} className="icon" style={{ marginLeft: 4 }} />
    )}
  </React.Fragment>
);

export default PercentWithStatus;
