import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/loanrequests/methods.js';


import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/textMasks.js';
import { toNumber, toMoney } from '/imports/js/finance-math';
import SavingIcon from './SavingIcon.jsx';

var timer;
const styles = {
  div: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    bottom: 10,
    right: -30,
  },
};


export default class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue || '',
      errorText: '',
      saving: false,
    };


    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }

  handleChange(event) {
    // Make sure value is a number if this is a number or money input
    const safeValue = this.props.number || this.props.money ?
      Number(event.target.value) :
      event.target.value;

    Meteor.clearTimeout(timer);
    this.setState({
      value: safeValue,
    }, () => {
      timer = Meteor.setTimeout(() => {
        this.setState({
          saving: true,
        }, this.saveValue);
      }, 500);
    });
  }

  handleBlur() {
    if (this.state.value !== this.props.currentValue) {
      this.setState({ saving: true },
        this.saveValue(),
      );
    }
  }

  componentWillUnmount() {
    Meteor.clearTimeout(timer);
  }


  saveValue() {
    // Save data to DB
    const object = {};

    if (this.props.money || this.props.number) {
      // Make sure we store a number if this is supposed to be one
      object[this.props.id] = toNumber(this.state.value);
    } else {
      object[this.props.id] = this.state.value;
    }
    const id = this.props.requestId;

    updateValues.call({
      object, id,
    }, (error, result) => {
      this.setState({ saving: false });
      if (error) {
        this.setState({ errorText: error.message });
        throw new Meteor.Error(500, error.message);
      } else {
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
              value={this.state.value}
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
            />
          }
        </TextField>
        {this.props.info &&
          null // TODO add an info icon that display the this.props.info string if it exists
        }
        <SavingIcon
          saving={this.state.saving}
          errorExists={this.state.errorText !== ''}
          style={styles.icon}
        />
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
  info: PropTypes.string,

  number: PropTypes.bool,
  money: PropTypes.bool,
};
