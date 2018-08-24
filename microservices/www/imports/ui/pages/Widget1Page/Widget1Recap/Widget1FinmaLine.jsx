import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';

const Widget1FinmaLine = ({ id, value, status }) => (
  <div className="widget1-finma-line">
    <span className="label">
      <T id={`Widget1FinmaLine.${id}`} />
    </span>
    <PercentWithStatus value={value} status={status} />
  </div>
);

Widget1FinmaLine.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.string,
  value: PropTypes.number.isRequired,
};

export default Widget1FinmaLine;
