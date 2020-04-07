import React from 'react';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from '../Material/Tooltip';
import T from '../Translation';

const CounterpartsOfferIcon = props => (
  <Tooltip title={<T id="Forms.withCounterparts" />} enterTouchDelay={0}>
    <FontAwesomeIcon icon={faExclamationCircle} className="icon primary" />
  </Tooltip>
);

export default CounterpartsOfferIcon;
