import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { tooltips } from '../../arrays/tooltips';
import Tooltip from './Tooltip/loadable';

const TextWithTooltip = ({
  placement,
  tooltipList,
  match,
  children,
  tooltipId,
}) => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef();
  const tooltipConfig = tooltipId
    ? { id: tooltipId, double: Array.isArray(tooltipId) }
    : tooltips(tooltipList)[match.toLowerCase()];

  useEffect(() => {
    // Do this to avoid triggering the ClickAwayListener initially
    if (open) {
      const timeout = setTimeout(() => setReady(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <>
      <span
        className="text-with-tooltip"
        tabIndex={-1}
        onClick={event => {
          // Trigger tooltip instead of another onClick handler in a parent
          event.preventDefault();
          event.stopPropagation();
          setOpen(!open);
          if (open) {
            setReady(false);
          }
        }}
        ref={ref}
      >
        {children}
      </span>
      <Tooltip
        placement={placement}
        tooltipConfig={tooltipConfig}
        match={match}
        open={open}
        anchorRef={ref}
        handleClose={() => {
          if (ready) {
            setOpen(false);
            setReady(false);
          }
        }}
      />
    </>
  );
};

TextWithTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  match: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  placement: PropTypes.string,
  tooltipList: PropTypes.string.isRequired,
};

TextWithTooltip.defaultProps = {
  match: undefined,
  placement: 'bottom',
};

export default TextWithTooltip;
