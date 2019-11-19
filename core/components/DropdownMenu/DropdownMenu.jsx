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
  className,
}) => {
  if (button) {
    return (
      <Button
        onClick={onClickHandler}
        disabled={disabled}
        className={className}
        {...buttonProps}
      />
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
      className={className}
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
  noWrapper,
  menuProps,
}) => {
  const onClickHandler = event => {
    // Prevent background from receiving clicks
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    // Pass currentTarget directly, to avoid it resetting to null
    // https://stackoverflow.com/questions/17607766/how-come-my-event-currenttarget-is-changing-automatically
    handleOpen(event.currentTarget);
  };

  const toRender = (
    <>
      {getTrigger({
        button,
        buttonProps,
        renderTrigger,
        onClickHandler,
        iconType,
        tooltip,
        tooltipPlacement,
        disabled,
        className: noWrapper ? className : '',
      })}
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={event => {
          // Stop propagation here to avoid parents' onClick from firing
          event.stopPropagation();
          handleClose();
        }}
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
        {...menuProps}
      >
        {options}
      </Menu>
    </>
  );

  if (noWrapper) {
    return toRender;
  }

  return (
    <div className={className} style={{ ...style }}>
      {toRender}
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
