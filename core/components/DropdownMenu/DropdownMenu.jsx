import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../Material/Menu';
import IconButton from '../IconButton';
import Button from '../Button';
import DropdownMenuContainer from './DropdownMenuContainer';

const getTrigger = ({
  button,
  buttonProps,
  renderTrigger,
  onClickHandler,
  iconType,
  tooltip,
  tooltipPlacement,
}) => {
  if (button) {
    return <Button onClick={onClickHandler} {...buttonProps} />;
  }
  if (renderTrigger) {
    return renderTrigger({ handleOpen: onClickHandler });
  }

  return (
    <IconButton
      onClick={onClickHandler}
      type={iconType}
      tooltip={tooltip}
      tooltipPlacement={tooltipPlacement}
      {...buttonProps}
    />
  );
};

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
  renderTrigger,
}) => {
  const onClickHandler = (event) => {
    // Prevent background from receiving clicks
    event.stopPropagation();
    // Pass currentTarget directly, to avoid it resetting to null
    // https://stackoverflow.com/questions/17607766/how-come-my-event-currenttarget-is-changing-automatically
    handleOpen(event.currentTarget);
  };

  return (
    <div className={className} style={{ ...style }}>
      {getTrigger({
        button,
        buttonProps,
        renderTrigger,
        onClickHandler,
        iconType,
        tooltip,
        tooltipPlacement,
      })}
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
};

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
