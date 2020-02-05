//
import React from 'react';
import cx from 'classnames';

const Box = ({ title, tag: Tag = 'div', className, children, ...props }) => (
  <Tag {...props} className={cx('box', className)}>
    {title && <span className="box-title">{title}</span>}
    {children}
  </Tag>
);

export default Box;
