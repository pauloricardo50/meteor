// @flow
import React from 'react';
import ReactCountUp from 'react-countup';

type CountUpProps = {
  start?: number,
  value: number,
  duration?: number,
  money?: boolean,
};

const CountUp = ({
  start = 0,
  value,
  duration = 2,
  money = false,
  ...otherProps
}: CountUpProps) => (
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
