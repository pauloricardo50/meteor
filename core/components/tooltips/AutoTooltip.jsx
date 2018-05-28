import React from 'react';
import PropTypes from 'prop-types';

import reactStringReplace from 'react-string-replace';

import { tooltips, TOOLTIP_LISTS } from 'core/arrays/tooltips';
import TooltipOverlay from './TooltipOverlay';
import { TooltipContainer } from './TooltipContext';

export const createRegexThatFindsAnyWordFromList = (list) => {
  if (list) {
    return new RegExp(`(${Object.keys(tooltips(list)).join('|')})`, 'gi');
  }

  return null;
};
const parseTextForTooltips = props =>
  reactStringReplace(
    props.children,
    createRegexThatFindsAnyWordFromList(props.tooltipList),
    (match, index) => (
      <TooltipOverlay {...props} key={index} match={match}>
        {match}
      </TooltipOverlay>
    ),
  );

export const AutoTooltip = (props) => {
  if (!props.children) {
    return null;
  }

  if (typeof props.children !== 'string') {
    // If no id is given and children is not a string, return
    return props.children;
  }
  // If no id is given and children is a string,
  // automatically replace all matching strings with tooltips
  const content = parseTextForTooltips(props);

  return <span>{content}</span>;
};

AutoTooltip.propTypes = {
  children: PropTypes.node,
  tooltipList: PropTypes.string,
};

AutoTooltip.defaultProps = {
  children: null,
  tooltipList: TOOLTIP_LISTS.GENERAL,
};

export default TooltipContainer(AutoTooltip);
