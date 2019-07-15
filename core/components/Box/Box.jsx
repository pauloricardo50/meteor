// @flow
import React from 'react';
import cx from 'classnames';

type BoxProps = {};

const Box = ({
  title,
  tag: Tag = 'div',
  className,
  children,
  ...props
}: BoxProps) => (
  <Tag {...props} className={cx('box', className)}>
    {title && <span className="box-title">{title}</span>}
    {children}
  </Tag>
);

export default Box;
