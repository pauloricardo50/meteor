import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { compose, withProps, withState, withStateHandlers } from 'recompose';

import Icon from '../Icon';
import Link from '../Link';
import Divider from '../Material/Divider';
import MenuItem from '../Material/MenuItem';

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
) => {
  const arr = [
    <MenuItem
      key={id}
      onClick={(event, index) => {
        if (event && event.stopPropagation) {
          // Prevent background from receiving clicks
          event.stopPropagation();
        }
        if (onClick) {
          onClick(index);
        }
        handleClose();
      }}
      {...otherProps}
      component={link ? Link : null}
    >
      {icon && (
        <ListItemIcon>
          <Icon type={icon} />
        </ListItemIcon>
      )}
      <ListItemText primary={label} secondary={secondary} />
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

const addState = compose(
  withState('fetchedOptions', 'setFetchedOptions', []),
  withStateHandlers(
    { anchorEl: null, isOpen: false, fetchedOptions: [] },
    {
      handleOpen: (_, { fetchOptions, setFetchedOptions }) => currentTarget => {
        if (fetchOptions) {
          fetchOptions().then(setFetchedOptions);
        }

        return {
          isOpen: true,
          anchorEl: currentTarget,
        };
      },
      handleClose: () => () => ({ isOpen: false }),
    },
  ),
);

export default compose(
  addState,
  withProps(
    ({
      options = [],
      fetchedOptions = [],
      fetchOptions,
      handleClose,
      classes,
    }) => {
      if (fetchOptions) {
        return {
          options: fetchedOptions.map(option =>
            mapOption(option, handleClose, classes),
          ),
        };
      }

      return {
        options: options.map(option => mapOption(option, handleClose, classes)),
      };
    },
  ),
);
