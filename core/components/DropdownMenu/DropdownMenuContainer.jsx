import React from 'react';
import { compose, withProps, withStateHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Divider from '../Material/Divider';
import MenuItem from '../Material/MenuItem';
import Icon from '../Icon';

const styles = theme => ({
  menuItem: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& $colorClass': {
        color: theme.palette.common.white,
      },
    },
  },
  menuItemRoot: {
    height: 'unset',
  },
  colorClass: {},
});

const mapOption = (
  {
    id,
    onClick,
    link,
    icon,
    label,
    dividerTop,
    dividerBottom,
    secondary,
    ...otherProps
  },
  handleClose,
  { menuItem: menuItemClass, menuItemRoot, colorClass },
) => {
  const arr = [
    <MenuItem
      key={id}
      onClick={(event, index) => {
        // Prevent background from receiving clicks
        event.stopPropagation();
        if (onClick) {
          onClick(index);
        }
        handleClose();
      }}
      {...otherProps}
      component={link ? Link : null}
      className={menuItemClass}
      classes={{ root: menuItemRoot }}
    >
      {icon && (
        <ListItemIcon className={colorClass}>
          <Icon type={icon} />
        </ListItemIcon>
      )}
      <ListItemText
        classes={{ primary: colorClass, secondary: colorClass }}
        inset={!!icon}
        primary={label}
        secondary={secondary}
      />
    </MenuItem>,
  ];

  // Add support for adding Dividers at the top or bottom of an option
  if (dividerTop) {
    arr.unshift(<Divider key={`divider${id}`} />);
  } else if (dividerBottom) {
    arr.push(<Divider key={`divider${id}`} />);
  }

  return arr;
};

const withState = withStateHandlers(
  { anchorEl: null, isOpen: false },
  {
    handleOpen: () => currentTarget => ({
      isOpen: true,
      anchorEl: currentTarget,
    }),
    handleClose: () => () => ({ isOpen: false }),
  },
);

export default compose(
  withState,
  withStyles(styles),
  withProps(({ options, handleClose, classes }) => ({
    options: options.map(option => mapOption(option, handleClose, classes)),
  })),
);
