import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
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
    const { id, label, icon, dividerTop, dividerBottom } = option;

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
        />
      </React.Fragment>
    </MenuItem>);

    if (dividerBottom) {
      array.push(<Divider key={`divider${id}`} />);
    }
  });

  return array;
};

const Select = (props) => {
  const {
    value,
    onChange,
    options,
    id,
    label,
    style,
    classes,
    ...otherProps
  } = props;

  return (
    <FormControl className="mui-select" style={style}>
      {label && (
        <InputLabel htmlFor={id} shrink>
          {label}
        </InputLabel>
      )}
      <MuiSelect
        {...otherProps}
        value={value}
        onChange={e => onChange(id, e.target.value)}
        id={id}
      >
        {mapOptions(options, classes)}
      </MuiSelect>
    </FormControl>
  );
};

Select.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Select.defaultProps = {
  value: undefined,
  label: undefined,
  style: {},
  id: '',
};

export default withStyles(styles)(Select);
