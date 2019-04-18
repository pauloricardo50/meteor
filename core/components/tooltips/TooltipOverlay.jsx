import React from 'react';
import PropTypes from 'prop-types';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { tooltips } from 'core/arrays/tooltips';
import track from 'core/utils/analytics';

import { isArray } from 'util';
import Tooltip from './Tooltip/loadable';

const onEntered = id => track('Tooltip - tooltip clicked', { id });

const handleClick = (event) => {
  // Trigger tooltip instead of another onClick handler in a parent
  event.preventDefault();
  event.stopPropagation();
};

const TooltipOverlay = ({
  placement,
  tooltipList,
  match,
  trigger,
  delayShow,
  children,
  tooltipId,
}) => {
  const tooltipConfig = tooltipId
    ? { id: tooltipId, double: isArray(tooltipId) }
    : tooltips(tooltipList)[match.toLowerCase()];

  return (
    <OverlayTrigger
      placement={placement}
      overlay={(
        <Tooltip
          placement={placement}
          trigger={trigger}
          tooltipConfig={tooltipConfig}
          match={match}
        />
      )}
      rootClose
      animation={false}
      trigger={trigger}
      delayShow={delayShow}
      onEntered={() => onEntered()}
      container={global.document !== undefined ? document.body : undefined}
      onClick={handleClick}
    >
      <span className="tooltip-overlay" tabIndex={-1}>
        {children}
      </span>
    </OverlayTrigger>
  );
};

TooltipOverlay.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  delayShow: PropTypes.number,
  match: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  placement: PropTypes.string,
  tooltipList: PropTypes.string.isRequired,
  trigger: PropTypes.arrayOf(PropTypes.string),
};

TooltipOverlay.defaultProps = {
  delayShow: 300,
  match: undefined,
  placement: 'bottom',
  trigger: ['click'], // Can be 'click', 'hover', and/or 'focus'
};

export default TooltipOverlay;
