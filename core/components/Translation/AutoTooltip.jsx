import React from 'react';
import PropTypes from 'prop-types';

import reactStringReplace from 'react-string-replace';

import { tooltips } from 'core/arrays/tooltips';
import TooltipOverlay from './TooltipOverlay';

const AutoTooltip = (props) => {
  let content = null;

  if (!props.children) {
    return null;
  }

  if (props.id) {
    // If an id is given, get that specific tooltip and wrap it around the children
    content = (
      <TooltipOverlay {...props} match={props.children}>
        {props.children}
      </TooltipOverlay>
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
        <TooltipOverlay {...props} key={i} match={match}>
          {match}
        </TooltipOverlay>
      ),
    );
  }

  return <span>{content}</span>;
};

AutoTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  list: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

AutoTooltip.defaultProps = {
  children: null,
  list: 'general',
  id: '',
};

export default AutoTooltip;
