import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import group from 'lodash/groupBy';

import Icon from '../Icon';
import Divider from '../Material/Divider';
import MenuItem from '../Material/MenuItem';
import T from '../Translation';

const groupOptions = (options, { groupBy, format = x => x }) => {
  const { undefined: undefinedGroup, ...grouped } = group(options, groupBy);
  const groups = Object.keys(grouped);

  const groupedOptions = groups.reduce(
    (acc, v) => [
      ...acc,
      { id: 'SELECT_GROUP', label: format(v) },
      ...grouped[v],
    ],
    [],
  );

  if (undefinedGroup?.length) {
    return [
      ...groupedOptions,
      { id: 'SELECT_GROUP', label: <T id="general.other" /> },
      ...undefinedGroup,
    ];
  }

  return groupedOptions;
};

export const mapSelectOptions = (options, grouping) => {
  const array = [];
  let finalOptions = options;

  if (grouping) {
    finalOptions = groupOptions(options, grouping);
  }

  finalOptions.forEach((option, index) => {
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
        <ListSubheader style={{ marginTop: 8 }} key={`${id}${index}`}>
          <b>{label}</b>
        </ListSubheader>,
      );
      array.push(<Divider key={`divider${id}`} />);
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
