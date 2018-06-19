import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
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

const makeMapOption = ({
  menuItem: menuItemClass,
  menuItemRoot,
  listItemTextWithIcon,
  colorClass,
}) => (option) => {
  // If a component is provided, return the component
  if (React.isValidElement(option)) {
    return option;
  }
  const { id, label, icon, dividerTop, dividerBottom } = option;
  const arr = [
    <MenuItem
      value={id}
      key={id}
      className={menuItemClass}
      classes={{ root: menuItemRoot }}
    >
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

const Select = (props) => {
  const {
    value,
    onChange,
    options,
    id,
    label,
    style,
    classes,
    inputStyle,
    ...otherProps
  } = props;
  const mapOption = makeMapOption(classes);

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
        input={<Input id={id} style={inputStyle} />}
      >
        {options.map(mapOption)}
      </MuiSelect>
    </FormControl>
  );
};

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string,
  label: PropTypes.node,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
};

Select.defaultProps = {
  value: undefined,
  label: undefined,
  style: {},
  inputStyle: {},
  id: '',
};

export default withStyles(styles)(Select);
