// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';

import Tooltip from '../Material/Tooltip';
import T from '../Translation';

type CounterpartsOfferIconProps = {};

const CounterpartsOfferIcon = (props: CounterpartsOfferIconProps) => (
  <Tooltip title={<T id="Forms.withCounterparts" />} enterTouchDelay={0}>
    <FontAwesomeIcon icon={faExclamationCircle} className="icon primary" />
  </Tooltip>
);

export default CounterpartsOfferIcon;
