import React, { PropTypes } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class StartSelectField extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.props.setFormState(
      this.props.id,
      value,
      () => this.props.setActiveLine(''),
    );
  }

  render() {
    return (
      <SelectField
        value={this.props.value || this.props.formState[this.props.id] || ''}
        onChange={this.handleChange}
        maxHeight={200}
      >
        {/* <MenuItem value={null} primaryText="" /> */}
        {this.props.options.map(
          option =>
            option.id !== undefined &&
            <MenuItem
              value={option.id}
              primaryText={option.label}
              key={option.id}
            />,
        )}
      </SelectField>
    );
  }
}

StartSelectField.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setFormState: PropTypes.func.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  label: PropTypes.string,
};
