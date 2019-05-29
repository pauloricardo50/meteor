// @flow
import React from 'react';
import cx from 'classnames';

type TimelineProps = {
  vertical: Boolean,
  horizontal: Boolean, // Not yet implemented
  events: Array<Object>,
};

const formatEvent = (event, index) => {
  const { complete = false, rightLabel = '', leftLabel } = event;
  return (
    <li className={cx({ complete })} key={index}>
      {leftLabel && <div className="left">{leftLabel}</div>}
      {rightLabel}
    </li>
  );
};

const hasLeftLabel = events => events.some(({ leftLabel }) => !!leftLabel);

const getLongestLeftLabelLength = events =>
  events.reduce(
    (max, { leftLabel = '' }) =>
      (leftLabel.length > max ? leftLabel.length : max),
    0,
  );

const Timeline = ({
  vertical = true,
  horizontal = false,
  events = [],
}: TimelineProps) => (
  <ul
    className={cx('timeline', { vertical, horizontal })}
    style={{
      paddingLeft: hasLeftLabel(events)
        ? `calc(${getLongestLeftLabelLength(events)} * 12px)`
        : '16px',
    }}
  >
    {events.map(formatEvent)}
  </ul>
);

export default Timeline;
