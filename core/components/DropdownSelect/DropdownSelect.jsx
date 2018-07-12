import React from 'react';
import PropTypes from 'prop-types';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import DropdownSelectContainer from './DropdownSelectContainer';
import IconButton from '../IconButton';

const DropdownSelect = ({
  handleClick,
  handleClose,
  handleChange,
  iconType,
  tooltip,
  anchorEl,
  options,
  selected,
  optionsIncludeOption,
}) => (
  <React.Fragment>
    <IconButton onClick={handleClick} type={iconType} tooltip={tooltip} />
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {options.map((option, index) => (
        <MenuItem
          key={index}
          selected={optionsIncludeOption(selected, option)}
          onClick={() => handleChange(option)}
        >
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  </React.Fragment>
);

DropdownSelect.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  optionsIncludeOption: PropTypes.func.isRequired,
  iconType: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  tooltip: PropTypes.node,
  anchorEl: PropTypes.any,
  selected: PropTypes.array,
};

DropdownSelect.defaultProps = {
  tooltip: null,
  anchorEl: null,
  selected: [],
};

export default DropdownSelectContainer(DropdownSelect);
