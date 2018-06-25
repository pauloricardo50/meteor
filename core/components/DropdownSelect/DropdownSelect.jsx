import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import IconButton from '../IconButton';

class DropdownSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      selectedOptions: this.props.selectedOptions || [],
    };
  }

  componentDidUpdate = ({ options: prevOptionsProps }) => {
    const { options } = this.props;
    if (!isEqual(options, prevOptionsProps)) {
      this.setState({ options });
    }
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  optionsIncludeOption = (options, { value }) =>
    !!options.find(option => isEqual(option.value, value));

  removeOptionFromOptions = (option, options) =>
    options.filter(({ value }) => !isEqual(value, option.value));

  handleSelect = (option) => {
    const { selectedOptions } = this.state;

    const newSelected = this.optionsIncludeOption(selectedOptions, option)
      ? this.removeOptionFromOptions(option, selectedOptions)
      : [...selectedOptions, option];

    this.setState({ selectedOptions: newSelected });

    this.props.onChange(newSelected);
  };

  render() {
    const { anchorEl, selectedOptions } = this.state;
    const { options, iconType, tooltip } = this.props;

    return (
      <div>
        <IconButton
          onClick={this.handleClick}
          type={iconType}
          tooltip={tooltip}
        />
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              selected={this.optionsIncludeOption(selectedOptions, option)}
              onClick={() => this.handleSelect(option)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

DropdownSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  iconType: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
  selectedOptions: PropTypes.array,
};

DropdownSelect.defaultProps = {
  tooltip: undefined,
  selectedOptions: [],
};

export default DropdownSelect;
