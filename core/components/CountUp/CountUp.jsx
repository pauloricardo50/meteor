import React from 'react';
import ReactCountUp from 'react-countup';

const CountUp = ({
  start = 0,
  value,
  duration = 2,
  money = false,
  ...otherProps
}) => (
  <ReactCountUp
    start={start}
    end={value}
    duration={duration}
    prefix={money ? 'CHF ' : ''}
    separator={money ? ' ' : ''}
    delay={2}
    {...otherProps}
  />
);

export default CountUp;
