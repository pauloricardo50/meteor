import React from 'react';
import { compose, mapProps } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MenuItem from '../Material/MenuItem';
import Divider from '../Material/Divider';
import Icon from '../Icon';

const styles = theme => ({
  menuItem: {
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $colorClass': {
        color: theme.palette.common.white,
      },
    },
  },
  menuItemRoot: {
    height: 'unset',
  },
  listItemTextWithIcon: {
    paddingLeft: 0,
  },
  colorClass: {},
});

const mapOptions = (
  options,
  { menuItem: menuItemClass, menuItemRoot, listItemTextWithIcon, colorClass },
) => {
  const array = [];
  options.forEach((option) => {
    if (React.isValidElement(option)) {
      return option;
    }
    const { id, label, icon, dividerTop, dividerBottom, secondary } = option;

    if (dividerTop) {
      array.push(<Divider key={`divider${id}`} />);
    }

    array.push(<MenuItem
      value={id}
      key={id}
      className={menuItemClass}
      classes={{ root: menuItemRoot }}
    >
      <React.Fragment>
        {icon && (
          <ListItemIcon className={colorClass}>
            <Icon type={icon} />
          </ListItemIcon>
        )}
        <ListItemText
          classes={{
            primary: colorClass,
            secondary: colorClass,
            root: icon ? listItemTextWithIcon : '',
          }}
          inset={!!icon}
          primary={label}
          secondary={secondary}
        />
      </React.Fragment>
    </MenuItem>);

    if (dividerBottom) {
      array.push(<Divider key={`divider${id}`} />);
    }
  });

  return array;
};

const SelectContainer = compose(
  withStyles(styles),
  mapProps(({ options, classes, ...otherProps }) => ({
    options: mapOptions(options, classes),
    ...otherProps,
  })),
);

export default SelectContainer;
