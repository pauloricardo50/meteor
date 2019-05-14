// @flow
import React from 'react';
import cx from 'classnames';

type StatItemProps = {};

const StatItem = ({
  value,
  increment,
  positive,
  title,
  children,
  top,
}: StatItemProps) => {
  if (children) {
    return (
      <div className="stat-item card1 card-top">
        <div className="top">{top}</div>
        {children}
      </div>
    );
  }

  return (
    <div className="stat-item card1 card-top">
      <div className="top">{top}</div>
      <div className="value">{value}</div>
      <h3 className="title">{title}</h3>
      <span className={cx({ success: positive, error: !positive })}>
        {increment}
      </span>
    </div>
  );
};
export default StatItem;
