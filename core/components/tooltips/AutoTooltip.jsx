import React from 'react';
import PropTypes from 'prop-types';
import reactStringReplace from 'react-string-replace';

import { TOOLTIP_LISTS, tooltips } from '../../arrays/tooltips';
import TextWithTooltip from './TextWithTooltip';
import { TooltipContainer } from './TooltipContext';

export const createRegexThatFindsAnyWordFromList = list => {
  if (list) {
    return new RegExp(`(${Object.keys(tooltips(list)).join('|')})`, 'gi');
  }

  return null;
};

export const reformatString = string => string.replace(/’/gi, "'");

const parseTextForTooltips = props =>
  reactStringReplace(
    reformatString(props.children),
    createRegexThatFindsAnyWordFromList(props.tooltipList),
    (match, index) => (
      <TextWithTooltip {...props} key={match} match={match}>
        {match}
      </TextWithTooltip>
    ),
  );

export const autoTooltipParser = (
  string,
  tooltipList = TOOLTIP_LISTS.GENERAL,
) => parseTextForTooltips({ children: string, tooltipList });

export const AutoTooltip = props => {
  const { children, tooltipId } = props;
  if (!children) {
    return null;
  }

  if (typeof children !== 'string') {
    // If no id is given and children is not a string, return
    return children;
  }

  if (tooltipId) {
    return <TextWithTooltip {...props}>{children}</TextWithTooltip>;
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
