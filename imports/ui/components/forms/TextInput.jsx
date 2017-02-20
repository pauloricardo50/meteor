import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';


import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/textMasks';
import { toNumber, toMoney } from '/imports/js/conversionFunctions';
import SavingIcon from './SavingIcon.jsx';
import InfoIcon from './InfoIcon.jsx';


var timer;
const styles = {
  div: {
    position: 'relative',
  },
  infoIcon: {
    position: 'absolute',
    bottom: 5,
    left: -40,
    padding: 10,
  },
  savingIcon: {
    position: 'absolute',
    top: 30,
    right: -25,
  },
  infoStyle: {
    color: '#4A90E2',
    borderColor: '#4A90E2',
  },
};


export default class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue || '',
      errorText: '',
      saving: false,
      showInfo: false,
    };

    // TODO: change saving only when something has successfully saved, not before


    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }

  handleChange(event) {
    // Make sure value is a number if this is a number or money input
    const safeValue = this.props.number || this.props.money
      ? toNumber(event.target.value)
      : event.target.value;

    this.setState({
      value: safeValue,
    }, () => {
      // do not show saving icon when changing text, only show it on blur
      this.saveValue(false);
    });
  }

  handleFocus() {
    this.setState({
      showInfo: true,
    });
  }

  handleBlur() {
    this.setState({
      showInfo: false,
    });
    // If the value has changed, save it
    // state is initialized as '', but currentValue is initially undefined, so check that too
    this.saveValue();
  }

  componentWillUnmount() {
    Meteor.clearTimeout(timer);
  }


  saveValue(showSaving = true) {
    // Save data to DB
    const object = {};

    if (this.props.money || this.props.number) {
      // Make sure we store a number if this is supposed to be one
      object[this.props.id] = toNumber(this.state.value);
    } else {
      object[this.props.id] = this.state.value;
    }
    const id = this.props.requestId;

    cleanMethod('update', id, object,
      (error) => {
        this.setState({ saving: false });
        if (!error) {
          // on success, set saving briefly to true, before setting it to false again to trigger icon
          this.setState({ errorText: '', saving: showSaving },
            this.setState({ saving: false }),
          );
        }
      });
  }

  render() {
    return (
      <div style={{ ...styles.div, ...this.props.style }}>
        <TextField
          floatingLabelText={this.props.label}
          hintText={this.props.placeholder}
          value={this.props.number ? toNumber(this.state.value) : this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          type="text"
          id={this.props.id}
          fullWidth
          multiLine={this.props.multiLine}
          rows={this.props.rows}
          pattern={this.props.number && '[0-9]*'}
          errorText={this.state.errorText || (this.state.showInfo && this.props.info)}
          errorStyle={this.state.errorText ? {} : styles.infoStyle}
          underlineFocusStyle={this.state.errorText ? {} : styles.infoStyle}
          floatingLabelShrinkStyle={this.state.showInfo && !this.state.errorText ? styles.infoStyle : {}}
          autoComplete={this.props.autocomplete || ''}
          disabled={this.props.disabled}
          style={this.props.style}
          inputStyle={this.props.inputStyle}
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
        {/* {this.props.info &&
          <InfoIcon
            id={this.props.id}
            info={this.props.info}
            style={styles.infoIcon}
          />
        } */}
        <SavingIcon
          saving={this.state.saving}
          errorExists={this.state.errorText !== ''}
          style={styles.savingIcon}
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
  autocomplete: PropTypes.string,
  multiLine: PropTypes.bool,
  rows: PropTypes.number,
  requestId: PropTypes.string.isRequired,
  info: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  disabled: PropTypes.bool,

  number: PropTypes.bool,
  money: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
  inputStyle: PropTypes.objectOf(PropTypes.any),
};
