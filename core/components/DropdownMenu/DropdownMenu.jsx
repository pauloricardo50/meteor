import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../Material/Menu';
import IconButton from '../IconButton';
import DropdownMenuContainer from './DropdownMenuContainer';

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

const DropdownMenu = ({
  isOpen,
  anchorEl,
  handleOpen,
  handleClose,
  iconType,
  options,
  style,
  tooltip,
  tooltipPlacement,
}) => (
  <div style={{ ...style }}>
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
    />

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
  isOpen: PropTypes.bool.isRequired,
  anchorEl: PropTypes.any,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  iconType: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  tooltip: PropTypes.node,
  tooltipPlacement: PropTypes.string,
};

DropdownMenu.defaultProps = {
  anchorEl: null,
  style: {},
  tooltip: undefined,
  tooltipPlacement: undefined,
};

export default DropdownMenuContainer(DropdownMenu);
