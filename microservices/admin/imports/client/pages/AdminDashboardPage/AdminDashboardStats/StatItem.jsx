import React from 'react';
import cx from 'classnames';

const StatItem = ({
  value,
  increment,
  positive,
  title,
  children,
  top,
  large,
}) => {
  if (children) {
    return (
      <div className="stat-item card1 card-top">
        <div className="top">{top}</div>
        {children}
      </div>
    );
  }

  return (
    <div className={cx('stat-item card1 card-top', { large })}>
      <div className="top">{top}</div>
      <div className={cx('value', { large })}>{value}</div>
      <div className="flex-col center-align">
        <h4 className="title">{title}</h4>
        <span className={cx({ success: positive, error: !positive })}>
          {increment}
        </span>
      </div>
    </div>
  );
};

export default StatItem;
