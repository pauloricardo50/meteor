import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import constants from '/imports/js/config/constants';
import colors from '/imports/js/config/colors';
import { swissFrancMask, decimalMask } from '/imports/js/helpers/textMasks';
import {
  toNumber,
  toDecimalNumber,
} from '/imports/js/helpers/conversionFunctions';
import SavingIcon from './SavingIcon';
import FormValidator from './FormValidator';

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
    bottom: 10,
    right: -25,
  },
  infoStyle: {
    color: colors.primary,
    borderColor: colors.primary,
  },
};

export default class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.currentValue === 0 ? 0 : props.currentValue || '',
      errorText: '',
      saving: false,
      showInfo: false,
    };

    if (props.number) {
      if (props.decimal) {
        this.formatter = toDecimalNumber;
      } else {
        this.formatter = toNumber;
      }
    } else {
      this.formatter = v => v;
    }
  }

  componentWillUnmount() {
    Meteor.clearTimeout(this.timeout);
  }

  handleBlur = () => {
    this.setState({ showInfo: false });
    // If the value has changed, save it
    // state is initialized as '', but currentValue is initially undefined, so check that too
    this.saveValue();
  };

  handleChange = (event) => {
    // Make sure value is a number if this is a number or money input
    const safeValue =
      this.props.number || this.props.money
        ? toNumber(event.target.value)
        : event.target.value;

    this.setState({ value: safeValue }, () => {
      // do not show saving icon when changing text, only show it on blur
      if (this.props.saveOnChange) {
        this.saveValue(false);
      }
    });
  };

  handleFocus = () => {
    this.setState({ showInfo: true });
  };

  saveValue = (showSaving = true) => {
    // Save data to DB
    const object = {};

    if (this.props.money || this.props.number) {
      // Make sure we store a number if this is supposed to be one
      object[this.props.id] = this.formatter(this.state.value);
    } else {
      object[this.props.id] = this.state.value;
    }

    Meteor.clearTimeout(this.timeout);
    this.timeout = Meteor.setTimeout(() => {
      cleanMethod(this.props.updateFunc, object, this.props.documentId)
        .then(() =>
          // on success, set saving briefly to true, before setting it to false again to trigger icon
          this.setState(
            { errorText: '', saving: showSaving },
            this.setState({ saving: false }),
          ),
        )
        .catch(() => {
          this.setState({ saving: false, value: this.props.currentValue });
          // If there was an error, reset value to the backend value
          this.setState({});
        });
    }, constants.cpsLimit);
  };

  render() {
    return (
      <div style={{ ...styles.div, ...this.props.style }}>
        <TextField
          floatingLabelText={this.props.label}
          floatingLabelFixed={this.props.floatingLabelFixed}
          hintText={this.props.placeholder}
          value={
            this.props.number
              ? this.formatter(this.state.value)
              : this.state.value
          }
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          type="text"
          id={this.props.id}
          fullWidth
          multiLine={this.props.multiLine}
          rows={this.props.rows}
          pattern={this.props.number && '[0-9]*'}
          errorText={
            this.state.errorText || (this.state.showInfo && this.props.info)
          }
          errorStyle={this.state.errorText ? {} : styles.infoStyle}
          underlineFocusStyle={this.state.errorText ? {} : styles.infoStyle}
          floatingLabelShrinkStyle={
            this.state.showInfo && !this.state.errorText ? styles.infoStyle : {}
          }
          autoComplete={this.props.autocomplete || ''}
          disabled={this.props.disabled}
          style={this.props.style}
          inputStyle={this.props.inputStyle}
          noValidate
        >
          {(this.props.money || this.props.decimal) &&
            <MaskedInput
              value={this.state.value}
              mask={this.props.money ? swissFrancMask : decimalMask}
              guide
              pattern="[0-9]*"
            />}
        </TextField>
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

TextInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  placeholder: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autocomplete: PropTypes.string,
  multiLine: PropTypes.bool,
  rows: PropTypes.number,
  documentId: PropTypes.string.isRequired,
  updateFunc: PropTypes.string,
  info: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  disabled: PropTypes.bool,
  number: PropTypes.bool,
  decimal: PropTypes.bool,
  money: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
  inputStyle: PropTypes.objectOf(PropTypes.any),
  floatingLabelFixed: PropTypes.bool,
  saveOnChange: PropTypes.bool,
};

TextInput.defaultProps = {
  currentValue: '',
  autocomplete: '',
  multiLine: false,
  rows: 1,
  info: '',
  disabled: false,
  number: false,
  decimal: false,
  money: false,
  style: undefined,
  inputStyle: undefined,
  updateFunc: 'updateRequest',
  floatingLabelFixed: true,
  saveOnChange: true,
};
