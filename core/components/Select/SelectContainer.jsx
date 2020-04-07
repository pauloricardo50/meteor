import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { compose, mapProps } from 'recompose';

import Icon from '../Icon';
import Divider from '../Material/Divider';
import MenuItem from '../Material/MenuItem';

const mapOptions = options => {
  const array = [];
  options.forEach((option, index) => {
    if (React.isValidElement(option)) {
      return option;
    }
    const {
      id,
      label,
      icon,
      dividerTop,
      dividerBottom,
      secondary,
      ...otherProps
    } = option;

    if (id === 'SELECT_GROUP') {
      array.push(
        <ListSubheader color="primary" key={`${id}${index}`}>
          {label}
        </ListSubheader>,
      );
      return;
    }

    if (dividerTop) {
      array.push(<Divider key={`divider${id}`} />);
    }

    array.push(
      <MenuItem value={id} key={id} {...otherProps}>
        <>
          {icon && (
            <ListItemIcon>
              <Icon type={icon} />
            </ListItemIcon>
          )}
          <ListItemText primary={label} secondary={secondary} />
        </>
      </MenuItem>,
    );

    if (dividerBottom) {
      array.push(<Divider key={`divider${id}`} />);
    }
  });

  return array;
};

const SelectContainer = compose(
  mapProps(({ options, onChange, id, ...otherProps }) => ({
    rawOptions: options,
    options: mapOptions(options),
    onChange: e => onChange(e.target.value, id),
    id,
    ...otherProps,
  })),
);

export default SelectContainer;
