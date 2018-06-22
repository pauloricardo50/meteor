import React from 'react';
import PropTypes from 'prop-types';

import { T, IntlNumber } from 'core/components/Translation';
import StatusIcon from '../../../components/StatusIcon';

const Widget1FinmaLine = ({ id, value, status }) => (
  <div className="widget1-finma-line">
    <span className="label">
      <T id={`Widget1FinmaLine.${id}`} />
    </span>
    {!!value && value > 0 ?
      <IntlNumber format="percentage" value={value} />
      :
      '-'
    }
    {!!value && value > 0 && <StatusIcon status={status} className="icon" />}
  </div>
);

Widget1FinmaLine.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  status: PropTypes.string,
};

export default Widget1FinmaLine;
