import React from 'react';
import cx from 'classnames';

const Recap2 = ({ array, ...props }) => (
  <div className="recap2" {...props}>
    {array.map(
      (
        {
          label,
          value,
          title,
          hide,
          space,
          className,
          Component = title ? 'h4' : 'div',
          ...rest
        },
        index,
      ) => {
        if (hide) {
          return null;
        }

        if (space) {
          return (
            <Component
              key={index}
              className={className}
              style={{ height: 16 }}
            />
          );
        }

        if (title) {
          return (
            <Component
              key={index}
              className={cx('text-center', className)}
              {...rest}
            >
              {label}
            </Component>
          );
        }

        return (
          <Component
            key={index}
            className={cx('recap2-item', className)}
            {...rest}
          >
            <p>{label}</p>
            <p>{value}</p>
          </Component>
        );
      },
    )}
  </div>
);

export default Recap2;
