import React from 'react';
import PropTypes from 'prop-types';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { tooltips } from 'core/arrays/tooltips';
import track from 'core/utils/analytics';

import Tooltip from './Tooltip';

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
}) => {
  const tooltipConfig = tooltips(tooltipList)[match.toLowerCase()];

  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip
          placement={placement}
          trigger={trigger}
          tooltipConfig={tooltipConfig}
          match={match}
        />
      }
      rootClose
      animation={false}
      trigger={trigger}
      delayShow={delayShow}
      onEntered={() => onEntered(id)}
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
  placement: PropTypes.string,
  tooltipList: PropTypes.string.isRequired,
  match: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  trigger: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  delayShow: PropTypes.number,
};

TooltipOverlay.defaultProps = {
  trigger: ['click'], // Can be 'click', 'hover', and/or 'focus'
  placement: 'bottom',
  delayShow: 300,
};

export default TooltipOverlay;
