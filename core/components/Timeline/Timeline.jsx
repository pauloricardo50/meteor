// @flow

import React, { Component } from 'react';
import cx from 'classnames';

type TimelineProps = {
  vertical: Boolean,
  horizontal: Boolean, // Not yet implemented
  events: Array<Object>,
  className?: string,
  id: string,
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

const getLongestLeftLabelLength = (id) => {
  const leftLabels = document.getElementById(id).getElementsByClassName('left');
  const widths = Array.from(leftLabels).map(({ clientWidth }) => clientWidth);
  return Math.max(...widths);
};

class Timeline extends Component<TimelineProps> {
  componentDidMount() {
    this.setPadding();
  }

  componentDidUpdate() {
    this.setPadding();
  }

  setPadding = () => {
    const { id, events } = this.props;
    if (id && hasLeftLabel(events)) {
      const padding = getLongestLeftLabelLength(id);
      const node = document.getElementById(id);
      node.style.setProperty('padding-left', `${padding}px`);
    }
  };

  render() {
    const {
      vertical = true,
      horizontal = false,
      events = [],
      className,
      id,
    } = this.props;

    return (
      <ul
        id={id}
        className={cx('timeline', { vertical, horizontal }, className)}
        style={{ paddingLeft: 8 }}
      >
        {events.map(formatEvent)}
      </ul>
    );
  }
}

export default Timeline;
