import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/creditrequests/methods.js';


import TextField from 'material-ui/TextField';

export default class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue ? this.props.currentValue : '',
    };


    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Only update if the value is new
    if (nextProps.currentValue !== this.state.value) {
      this.setState({ value: nextProps.currentValue });
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleBlur(event) {
    this.props.changeSaving(true);

    // Save data to DB
    const object = {};
    object[this.props.id] = event.target.value;
    const id = this.props.requestId;

    updateValues.call({
      object, id,
    }, (error, result) => {
      this.props.changeSaving(false);

      if (error) {
        this.props.changeErrors(error.message);
        throw new Meteor.Error(500, error.message);
      } else {
        this.props.changeErrors('');
        return 'Update Successful';
      }
    });
  }

  render() {
    return (
      <div className="form-group">
        <TextField
          floatingLabelText={this.props.label}
          hintText={this.props.placeholder}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          type="text"
          id={this.props.id}
          fullWidth
        />
      </div>
    );
  }
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  currentValue: PropTypes.string,
  requestId: PropTypes.string.isRequired,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
};
