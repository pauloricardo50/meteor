import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


import SavingIcon from './SavingIcon.jsx';
import { updateValues } from '/imports/api/loanrequests/methods';


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

export default class SelectFieldInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue || null,
      errorText: '',
      saving: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent weird component rerenders, which break keyboard+mouse use of this component
    return this.props.currentValue !== nextProps.currentValue ||
      this.state !== nextState;
  }

  handleChange(event, index, value) {
    this.setState({ value }, () => this.saveValue());
  }

  saveValue() {
    const object = {};

    object[this.props.id] = this.state.value;
    const id = this.props.requestId;

    updateValues.call({
      object, id,
    }, (error, result) => {
      this.setState({ saving: false });
      if (error) {
        this.setState({ errorText: error.message });
        throw new Meteor.Error(500, error.message);
      } else {
        // on success, set saving briefly to true, before setting it to false again to trigger icon
        this.setState({ errorText: '', saving: true },
          this.setState({ saving: false }),
        );
        return 'Update Successful';
      }
    });
  }

  render() {
    return (
      <div style={styles.div}>
        <SelectField
          floatingLabelText={this.props.label}
          value={this.state.value}
          onChange={this.handleChange}
          errorText={this.state.errorText}
          fullWidth
          maxHeight={200}
        >
          <MenuItem value={null} primaryText="" />
          {this.props.options.map((option, index) =>
            (<MenuItem
              value={option.key}
              primaryText={option.name}
              key={index}
            />),
          )}
        </SelectField>
        <SavingIcon
          saving={this.state.saving}
          errorExists={this.state.errorText !== ''}
          style={styles.savingIcon}
        />
      </div>
    );
  }
}


SelectFieldInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  requestId: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(React.PropTypes.object).isRequired,
};
