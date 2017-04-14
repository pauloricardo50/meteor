import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RcTooltip from 'rc-tooltip';

import tooltips from '/imports/js/arrays/tooltips';

const styles = {
  span: {
    borderBottom: 'dashed 1px #aaaaaa',
    cursor: 'pointer',
  },
  tooltip: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    display: 'block',
    // width: 'min-content',
    maxWidth: 120,
  },
};

const Tooltip = props => {
  if (!tooltips[props.id]) {
    throw new Meteor.Error(
      'No tooltip found',
      "tooltip id doesn't match any existing tooltip",
    );
  }

  return (
    <RcTooltip
      placement={props.placement}
      trigger={props.trigger}
      overlay={<span style={styles.text}>{tooltips[props.id]}</span>}
      overlayStyle={styles.tooltip}
      mouseLeaveDelay={0}
    >
      <span style={styles.span}>
        {props.children}
      </span>
    </RcTooltip>
  );
};

Tooltip.propTypes = {
  placement: PropTypes.string,
  trigger: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
};

Tooltip.defaultProps = {
  placement: 'bottom',
  trigger: ['click'], // Can be 'click', 'hover' and/or 'focus'
};

export default Tooltip;
