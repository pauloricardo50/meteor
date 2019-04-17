import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Switch from '@material-ui/core/Switch';

const Toggle = ({
  toggled,
  onToggle,
  labelTop,
  labelLeft,
  labelRight,
  className,
}) => (
  <div className={cx('toggle', className)}>
    {labelTop && (
      <div className="toggle-label toggle-label-top">{labelTop}</div>
    )}

    <div className="toggle-content">
      {labelLeft && (
        <span className="toggle-label toggle-label-left">{labelLeft}</span>
      )}

      <Switch style={{ height: 26 }} checked={toggled} onChange={onToggle} />

      {labelRight && (
        <span className="toggle-label toggle-label-right">{labelRight}</span>
      )}
    </div>
  </div>
);

Toggle.propTypes = {
  className: PropTypes.string,
  labelLeft: PropTypes.node,
  labelRight: PropTypes.node,
  labelTop: PropTypes.node,
  onToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
};

Toggle.defaultProps = {
  className: undefined,
  labelTop: undefined,
  labelLeft: undefined,
  labelRight: undefined,
};

export default Toggle;
