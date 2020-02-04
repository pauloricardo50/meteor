//      

import React, { Component } from 'react';
import cx from 'classnames';

                      
                   
                        
                     
             
  

const makeFormatEvent = variant => (
  { complete = false, mainLabel = '', secondaryLabel, children },
  index,
) => {
  if (variant === 'vertical') {
    return (
      <li className={cx('timeline-item', { complete })} key={index}>
        {children}
        {secondaryLabel && (
          <div className="secondary-label">{secondaryLabel}</div>
        )}
        <div className="main-label">{mainLabel}</div>
      </li>
    );
  }

  return (
    <li className={cx('timeline-item', { complete })} key={index}>
      {children}
      <div className="main-label">{mainLabel}</div>
      {secondaryLabel && (
        <div className="secondary-label">{secondaryLabel}</div>
      )}
    </li>
  );
};

const hasSecondaryLabel = events =>
  events.some(({ secondaryLabel }) => !!secondaryLabel);

const getLongestSecondaryLabelLength = id => {
  const leftLabels = document
    .getElementById(id)
    .getElementsByClassName('secondary-label');
  const widths = Array.from(leftLabels).map(({ clientWidth }) => clientWidth);
  return Math.max(...widths);
};

class Timeline extends Component                {
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
