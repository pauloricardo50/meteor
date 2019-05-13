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
}: StatItemProps) => (
  <div className="stat-item card1 card-top">
    {children}
    <div className="value">{value}</div>
    <h3 className="title">{title}</h3>
    <span className={cx({ success: positive, error: !positive })}>
      {increment}
    </span>
  </div>
);

export default StatItem;
