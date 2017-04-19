import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import RcTooltip from 'rc-tooltip';
import reactStringReplace from 'react-string-replace';

import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

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

const AutoTooltip = props => {
  if (!props.children) {
    return null;
  }
  if (typeof props.children !== 'string') {
    return props.children;
  }

  return (
    <span>
      {reactStringReplace(
        props.children,
        new RegExp(`(${Object.keys(tooltips).join('|')})`, 'gi'),
        (match, i) => (
        // <RcTooltip
        //   placement={props.placement}
        //   trigger={props.trigger}
        //   overlay={
        //     <span style={styles.text}>{tooltips[match.toLowerCase()]}</span>
        //   }
        //   overlayStyle={styles.tooltip}
        //   mouseLeaveDelay={0}
        //   key={i}
        // >
        //   <span style={styles.span}>
        //     {match}
        //   </span>
        // </RcTooltip>
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="tooltip">
                <span style={styles.text}>{tooltips[match.toLowerCase()]}</span>
              </Tooltip>
            }
            key={i}
            rootClose
          >
            <span style={styles.span}>
              {match}
            </span>
          </OverlayTrigger>
        ),
      )}
    </span>
  );
};

AutoTooltip.propTypes = {
  placement: PropTypes.string,
  trigger: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

AutoTooltip.defaultProps = {
  placement: 'bottom',
  trigger: ['click'], // Can be 'click', 'hover' and/or 'focus'
  children: null,
};

export default AutoTooltip;
