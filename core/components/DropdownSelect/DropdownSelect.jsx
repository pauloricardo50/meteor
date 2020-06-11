import React from 'react';
import Menu from '@material-ui/core/Menu';
import PropTypes from 'prop-types';

import IconButton from '../IconButton';
import MenuItem from '../Material/MenuItem';
import DropdownSelectContainer from './DropdownSelectContainer';

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
  <>
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
  </>
);

DropdownSelect.propTypes = {
  anchorEl: PropTypes.any,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  iconType: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  optionsIncludeOption: PropTypes.func.isRequired,
  selected: PropTypes.array,
  tooltip: PropTypes.node,
};

DropdownSelect.defaultProps = {
  tooltip: null,
  anchorEl: null,
  selected: [],
};

export default DropdownSelectContainer(DropdownSelect);
