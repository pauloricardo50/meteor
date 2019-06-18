// @flow

import React, { Component } from 'react';
import cx from 'classnames';

type TimelineProps = {
  variant?: String,
  events: Array<Object>,
  className?: string,
  id: string,
};

const makeFormatEvent = variant => (
  { complete = false, mainLabel = '', secondaryLabel },
  index,
) => {
  if (variant === 'vertical') {
    return (
      <li className={cx({ complete })} key={index}>
        {secondaryLabel && (
          <div className="secondary-label">{secondaryLabel}</div>
        )}
        <div className="main-label">{mainLabel}</div>
      </li>
    );
  }

  return (
    <li className={cx({ complete })} key={index}>
      <div className="main-label">{mainLabel}</div>
      {secondaryLabel && (
        <div className="secondary-label">{secondaryLabel}</div>
      )}
    </li>
  );
};

const hasSecondaryLabel = events =>
  events.some(({ secondaryLabel }) => !!secondaryLabel);

const getLongestSecondaryLabelLength = (id) => {
  const leftLabels = document
    .getElementById(id)
    .getElementsByClassName('secondary-label');
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
    const { id, events, variant } = this.props;

    if (variant === 'vertical' && id && hasSecondaryLabel(events)) {
      const padding = getLongestSecondaryLabelLength(id);
      const node = document.getElementById(id);
      node.style.setProperty('padding-left', `${padding}px`);
    }
  };

  render() {
    const { variant, events = [], className, id } = this.props;

    return (
      <ul
        id={id}
        className={cx('timeline', variant, className)}
        style={{ paddingLeft: 8 }}
      >
        {events.map(makeFormatEvent(variant))}
      </ul>
    );
  }
}

Timeline.defaultProps = {
  className: '',
  variant: 'vertical',
};

export default Timeline;
