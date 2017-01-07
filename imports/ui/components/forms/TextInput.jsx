import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/creditrequests/methods.js';


import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/textMasks.js';
import { toNumber, toMoney } from '/imports/js/finance-math';


var timer;
const styles = {
  div: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: '60%',
    right: -20,
  },
};


export default class TextInput extends Component {
  constructor(props) {
    super(props);

    if (this.props.currentValue) {
      this.state = {
        value: this.props.currentValue,
        errorText: '',
      };
    } else {
      this.state = {
        value: '',
        errorText: '',
      };
    }


    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }

  handleChange(event) {
    Meteor.clearTimeout(timer);
    this.setState({
      value: event.target.value,
    }, () => {
      timer = Meteor.setTimeout(this.saveValue, 400);
    });
  }

  handleBlur() {
    if (this.state.value !== this.props.currentValue) {
      this.saveValue();
    }
  }

  componentWillUnmount() {
    Meteor.clearTimeout(timer);
  }

  saveValue() {
    this.props.changeSaving(true);

    // Save data to DB
    const object = {};

    if (this.props.money || this.props.number) {
      // Make sure we store a number if this is supposed to be one
      object[this.props.id] = Number(this.state.value);
    } else {
      object[this.props.id] = this.state.value;
    }
    const id = this.props.requestId;

    updateValues.call({
      object, id,
    }, (error, result) => {
      this.props.changeSaving(false);

      if (error) {
        this.props.changeErrors(error.message);
        this.setState({ errorText: error.message });
        throw new Meteor.Error(500, error.message);
      } else {
        this.props.changeErrors('');
        this.setState({ errorText: '' });
        return 'Update Successful';
      }
    });
  }

  render() {
    return (
      <div style={styles.div}>
        <TextField
          floatingLabelText={this.props.label}
          hintText={this.props.placeholder}
          value={this.props.number ? toNumber(this.state.value) : this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          type="text"
          id={this.props.id}
          fullWidth
          multiLine={this.props.multiLine}
          rows={this.props.rows}
          pattern={this.props.number && '[0-9]*'}
          errorText={this.state.errorText}
        >
          {this.props.money &&
            <MaskedInput
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
            />
          }
        </TextField>
        {/* <span className="fa fa-info" style={styles.icon}/> */}
      </div>
    );
  }
}

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  placeholder: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  multiLine: PropTypes.bool,
  rows: PropTypes.number,
  requestId: PropTypes.string.isRequired,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
  onChange: PropTypes.func,

  number: PropTypes.bool,
  money: PropTypes.bool,
};
