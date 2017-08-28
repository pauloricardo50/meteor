import PropTypes from 'prop-types';
import React, { Component } from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import SavingIcon from './SavingIcon.jsx';
import FormValidator from './FormValidator.jsx';
import cleanMethod from '/imports/api/cleanMethods';

const styles = {
  div: {
    position: 'relative',
  },
  savingIcon: {
    position: 'absolute',
    top: 30,
    right: -30,
  },
};

export default class SelectFieldInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue || null,
      errorText: '',
      saving: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent weird component rerenders, which break keyboard+mouse use of this component
    return (
      this.props.currentValue !== nextProps.currentValue ||
      this.state !== nextState
    );
  }

  handleChange = (event, index, value) => {
    this.setState({ value }, () => this.saveValue());
  };

  saveValue = () => {
    const object = {};

    object[this.props.id] = this.state.value;

    cleanMethod(this.props.updateFunc, object, this.props.documentId)
      .then(() =>
        // on success, set saving briefly to true, before setting it to false again to trigger icon
        this.setState(
          { errorText: '', saving: true },
          this.setState({ saving: false }),
        ),
      )
      .catch(error =>
        this.setState({ saving: false, errorText: error.message }),
      );
  };

  render() {
    return (
      <div style={{ ...styles.div, ...this.props.style }}>
        <SelectField
          floatingLabelText={this.props.label}
          value={this.state.value}
          onChange={this.handleChange}
          errorText={this.state.errorText}
          fullWidth
          maxHeight={200}
          style={this.props.style}
          disabled={this.props.disabled}
        >
          <MenuItem value={null} primaryText="" key={0} />
          {this.props.options.map((option, index) =>
            (<MenuItem
              value={option.id}
              primaryText={option.label}
              key={option.id}
            />),
          )}
        </SelectField>
        <SavingIcon
          saving={this.state.saving}
          errorExists={this.state.errorText !== ''}
          style={styles.savingIcon}
        />
        {!this.props.noValidator && <FormValidator {...this.props} />}
      </div>
    );
  }
}

SelectFieldInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  documentId: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateFunc: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

SelectFieldInput.defaultProps = {
  currentValue: undefined,
};
