import React from 'react';
import PropTypes from 'prop-types';

import reactStringReplace from 'react-string-replace';

import { tooltips, TOOLTIP_LISTS } from 'core/arrays/tooltips';
import TooltipOverlay from './TooltipOverlay';
import { TooltipContainer } from './TooltipContext';

const createRegexForTooltipList = list =>
  new RegExp(`(${Object.keys(tooltips(list)).join('|')})`, 'gi');

const parseTextForTooltips = props =>
  reactStringReplace(
    props.children,
    createRegexForTooltipList(props.tooltipList),
    (match, i) => (
      <TooltipOverlay {...props} key={i} match={match}>
        {match}
      </TooltipOverlay>
    ),
  );

export const AutoTooltip = (props) => {
  let content = null;

  if (!props.children) {
    return null;
  }

  if (typeof props.children !== 'string') {
    // If no id is given and children is not a string, return
    return props.children;
  }
  // If no id is given and children is a string,
  // automatically replace all matching strings with tooltips
  content = parseTextForTooltips(props);

  return <span>{content}</span>;
};

AutoTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  tooltipList: PropTypes.string,
};

AutoTooltip.defaultProps = {
  children: null,
  tooltipList: TOOLTIP_LISTS.GENERAL,
};

export default TooltipContainer(AutoTooltip);
