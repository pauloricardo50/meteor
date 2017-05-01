import React from 'react';
import PropTypes from 'prop-types';

import reactStringReplace from 'react-string-replace';

import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { tooltips, tooltipsById } from '/imports/js/arrays/tooltips';

const styles = {
  span: {
    borderBottom: 'dashed 1px #aaaaaa',
    cursor: 'help',
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
  let content = null;

  if (!props.children) {
    return null;
  }

  if (props.id) {
    // If an id is given, get that specific tooltip and wrap it around the children
    content = (
      <OverlayTrigger
        placement={props.placement}
        overlay={
          <Tooltip id="tooltip">
            <span style={styles.text}>
              {tooltipsById(props.id)}
            </span>
          </Tooltip>
        }
        rootClose
      >
        <span style={styles.span}>
          {props.children}
        </span>
      </OverlayTrigger>
    );
  } else if (typeof props.children !== 'string') {
    // If no id is given and children is not a string, return
    return props.children;
  } else {
    // If no id is given and children is a string,
    // automatically replace all matching strings with tooltips
    content = reactStringReplace(
      props.children,
      new RegExp(`(${Object.keys(tooltips(props.list)).join('|')})`, 'gi'),
      (match, i) => (
        <OverlayTrigger
          placement={props.placement}
          overlay={
            <Tooltip id="tooltip">
              <span style={styles.text}>
                {tooltips(props.list)[match.toLowerCase()]}
              </span>
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
    );
  }

  return <span>{content}</span>;
};

AutoTooltip.propTypes = {
  placement: PropTypes.string,
  trigger: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  list: PropTypes.string,
  id: PropTypes.string,
};

AutoTooltip.defaultProps = {
  placement: 'bottom',
  trigger: ['click'], // Can be 'click', 'hover', and/or 'focus'
  children: null,
  list: 'general',
  id: '',
};

export default AutoTooltip;

// If you want to use rc-tooltip

// import RcTooltip from 'rc-tooltip';

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
