import React from 'react';
import PropTypes from 'prop-types';

import Switch from '@material-ui/core/Switch';

const Toggle = ({ toggled, onToggle, labelTop, labelLeft, labelRight }) => (
  <div className="toggle">
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
  labelLeft: PropTypes.node,
  labelRight: PropTypes.node,
  labelTop: PropTypes.node,
  onToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
};

Toggle.defaultProps = {
  labelTop: undefined,
  labelLeft: undefined,
  labelRight: undefined,
};

export default Toggle;
