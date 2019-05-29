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
  disabled,
}) => {
  if (button) {
    return (
      <Button onClick={onClickHandler} disabled={disabled} {...buttonProps} />
    );
  }
  if (renderTrigger) {
    return renderTrigger({ handleOpen: onClickHandler, disabled });
  }

  return (
    <IconButton
      onClick={onClickHandler}
      type={iconType}
      tooltip={tooltip}
      tooltipPlacement={tooltipPlacement}
      disabled={disabled}
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
  maxHeight,
  paperClassName,
  disabled,
}) => {
  const onClickHandler = (event) => {
    // Prevent background from receiving clicks
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
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
        disabled,
      })}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        classes={{ paper: paperClassName }}
        PaperProps={{
          style: {
            maxHeight:
              maxHeight >= 0
                ? maxHeight === 0
                  ? maxHeight
                  : undefined
                : 48 * 4.5,
          },
        }}
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
  iconType: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  tooltip: PropTypes.node,
  tooltipPlacement: PropTypes.string,
};

DropdownMenu.defaultProps = {
  anchorEl: null,
  className: '',
  iconType: undefined,
  style: {},
  tooltip: undefined,
  tooltipPlacement: undefined,
};

export default DropdownMenuContainer(DropdownMenu);
