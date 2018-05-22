import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';

import Icon from '../Icon';
import MenuItem from 'core/components/Material/MenuItem';
import Divider from 'core/components/Material/Divider';

const styles = {
  icon: {
    top: 'calc(50% - 12px)',
  },
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const mapOption = (option) => {
  // If a component is provided, return the component
  if (React.isValidElement(option)) {
    return option;
  }
  const { id, label, icon, dividerTop, dividerBottom } = option;
  const arr = [
    <MenuItem value={id} key={id}>
      {icon && <Icon type={icon} style={{ margin: '0 16px 0 8px' }} />}
      {label}
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
        classes={{ ...classes, icon: classes.icon }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              minWidth: 200,
            },
          },
        }}
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
  classes: PropTypes.object,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
};

Select.defaultProps = {
  value: undefined,
  label: undefined,
  classes: undefined,
  style: {},
  inputStyle: {},
  id: '',
};

export default withStyles(styles)(Select);
