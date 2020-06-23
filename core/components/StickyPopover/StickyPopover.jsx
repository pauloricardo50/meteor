import React, { useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';

import useSticky from './useSticky';

const StickyPopover = ({
  enterDelay,
  exitDelay,
  component,
  children,
  placement,
  title,
  forceOpen,
  paperProps,
  onMouseEnter,
}) => {
  const { show, targetProps, stickyProps } = useSticky({
    enterDelay,
    exitDelay,
    onMouseEnter,
  });
  const ref = useRef();
  const finalShow = forceOpen || show;

  const [enhancedChildren] = React.Children.map(children, child =>
    React.cloneElement(child, {
      ...targetProps,
      ref,
      onFocus: targetProps.handleMouseEnter,
      onBlur: targetProps.handleMouseLeave,
      showPopover: finalShow,
    }),
  );

  return (
    <>
      {enhancedChildren}
      <Popper
        open={finalShow}
        anchorEl={ref.current}
        placement={placement}
        onClick={e => e.stopPropagation()}
        style={{ zIndex: 9999 }}
        {...stickyProps}
      >
        <Paper
          style={{ padding: 8 }}
          elevation={15}
          className="popover-content"
          {...paperProps}
        >
          {title && <h4 className="mt-0 mb-4">{title}</h4>}
          {component}
        </Paper>
      </Popper>
    </>
  );
};

StickyPopover.propTypes = {
  children: PropTypes.element.isRequired,
  component: PropTypes.node.isRequired,
  enterDelay: PropTypes.number,
  exitDelay: PropTypes.number,
  onMouseEnter: PropTypes.func,
  placement: PropTypes.string,
  title: PropTypes.node,
};

StickyPopover.defaultProps = {
  enterDelay: 0,
  exitDelay: 200,
  onMouseEnter: undefined,
  placement: 'right-start',
  title: null,
};

export default StickyPopover;
