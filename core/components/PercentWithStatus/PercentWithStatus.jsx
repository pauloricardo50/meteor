//
import React from 'react';

import { Percent } from '../Translation';
import StatusIcon from '../StatusIcon';
import { SUCCESS, ERROR } from '../../api/constants';

const PercentWithStatus = ({
  value,
  status = value >= 1 ? SUCCESS : ERROR,
  id,
  tooltip,
  rounded,
}) => (
  <>
    {Number.isNaN(value) ? '-' : <Percent value={value} rounded={rounded} />}
    {!Number.isNaN(value) && (
      <StatusIcon
        status={status}
        className="icon"
        style={{ marginLeft: 4 }}
        tooltip={tooltip}
        id={id}
      />
    )}
  </>
);

export default PercentWithStatus;
