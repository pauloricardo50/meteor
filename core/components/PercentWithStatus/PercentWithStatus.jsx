// @flow
import React from 'react';

import { Percent } from '../Translation';
import StatusIcon from '../StatusIcon';
import { SUCCESS, ERROR } from '../../api/constants';

type PercentWithStatusProps = {
  value: number,
  status?: String,
  tooltip?: String,
  id?: String,
};

const PercentWithStatus = ({
  value,
  status = value >= 1 ? SUCCESS : ERROR,
  id,
  tooltip,
}: PercentWithStatusProps) => (
  <React.Fragment>
    {Number.isNaN(value) ? '-' : <Percent value={value} />}
    {!Number.isNaN(value) && (
      <StatusIcon
        status={status}
        className="icon"
        style={{ marginLeft: 4 }}
        tooltip={tooltip}
        id={id}
      />
    )}
  </React.Fragment>
);

export default PercentWithStatus;
