import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../Material/Menu';
import IconButton from '../IconButton';
import Button from '../Button';
import DropdownMenuContainer from './DropdownMenuContainer';

const DropdownMenu = ({
  anchorEl,
  button,
  buttonProps,
  className,
  handleClose,
  handleOpen,
  iconType,
  isOpen,
  options,
  style,
  tooltip,
  tooltipPlacement,
}) => (
  <div className={className} style={{ ...style }}>
    {button ? (
      <Button
        onClick={(event) => {
          // Prevent background from receiving clicks
          event.stopPropagation();
          // Pass currentTarget directly, to avoid it resetting to null
          // https://stackoverflow.com/questions/17607766/how-come-my-event-currenttarget-is-changing-automatically
          handleOpen(event.currentTarget);
        }}
        {...buttonProps}
      />
    ) : (
      <IconButton
        onClick={(event) => {
          // Prevent background from receiving clicks
          event.stopPropagation();
          // Pass currentTarget directly, to avoid it resetting to null
          // https://stackoverflow.com/questions/17607766/how-come-my-event-currenttarget-is-changing-automatically
          handleOpen(event.currentTarget);
        }}
        type={iconType}
        tooltip={tooltip}
        tooltipPlacement={tooltipPlacement}
        {...buttonProps}
      />
    )}
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
    >
      {options}
    </Menu>
  </div>
);

DropdownMenu.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  iconType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  tooltip: PropTypes.node,
  tooltipPlacement: PropTypes.string,
};

DropdownMenu.defaultProps = {
  anchorEl: null,
  className: '',
  style: {},
  tooltip: undefined,
  tooltipPlacement: undefined,
};

export default DropdownMenuContainer(DropdownMenu);
