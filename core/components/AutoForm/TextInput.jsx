import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import constants from 'core/config/constants';
import colors from 'core/config/colors';
import { toNumber, toDecimalNumber } from 'core/utils/conversionFunctions';

import MyTextInput from 'core/components/TextInput';

import ValidIcon from './ValidIcon';
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
    top: 16,
    right: -25,
  },
  infoStyle: {
    color: colors.primary,
    borderColor: colors.primary,
  },
};

class TextInput extends Component {
  constructor(props) {
    super(props);

    const { currentValue, number, decimal } = props.inputProps;

    this.state = {
      // Make sure 0 values are displayed properly
      value: currentValue === 0 ? 0 : currentValue || '',
      errorText: '',
      saving: false,
      showInfo: false,
    };

    if (number) {
      if (decimal) {
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

  handleChange = (_, value) => {
    // Make sure value is a number if this is a number or money input
    // const safeValue =
    //   this.props.number || this.props.money
    //     ? toNumber(event.target.value)
    //     : event.target.value;

    this.setState({ value }, () => {
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
    const {
      updateFunc,
      docId,
      inputProps: { id, currentValue },
    } = this.props;
    const { value } = this.state;
    // Save data to DB
    const object = { [id]: value };

    Meteor.clearTimeout(this.timeout);
    this.timeout = Meteor.setTimeout(() => {
      updateFunc({ object, id: docId })
        .then(() =>
          // on success, set saving briefly to true, before setting it to false again to trigger icon
          this.setState(
            { errorText: '', saving: showSaving },
            this.setState({ saving: false }),
          ))
        .catch(() => {
          // If there was an error, reset value to the backend value
          this.setState({ saving: false, value: currentValue });
        });
    }, constants.cpsLimit);
  };

  render() {
    const {
      inputProps: {
        style,
        label,
        placeholder,
        number,
        id,
        multiline,
        rows,
        info,
        disabled,
        money,

        required,
        ...otherProps
      },
      noValidator,
      admin,
    } = this.props;
    const { value, errorText, saving, showInfo } = this.state;

    let type;
    if (money) {
      type = 'money';
    } else if (number) {
      type = 'number';
    } else {
      type = 'text';
    }

    return (
      <div style={{ ...styles.div, ...style }}>
        <MyTextInput
          {...otherProps}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          type={type}
          id={id}
          multiline={multiline}
          rows={rows}
          info={errorText || (showInfo && info)}
          error={!!errorText}
          disabled={disabled}
          style={{ width: '100%', ...style, marginBottom: 16 }}
          noValidate
          fullWidth
        />
        <ValidIcon
          saving={saving}
          error={!!errorText}
          style={styles.savingIcon}
          value={value}
          required={required}
          hide={admin}
        />
        {!noValidator && <FormValidator {...this.props} />}
      </div>
    );
  }
}

TextInput.propTypes = {
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autocomplete: PropTypes.string,
  rows: PropTypes.number,
  docId: PropTypes.string.isRequired,
  updateFunc: PropTypes.func,
  info: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  number: PropTypes.bool,
  decimal: PropTypes.bool,
  money: PropTypes.bool,
  inputStyle: PropTypes.objectOf(PropTypes.any),
  floatingLabelFixed: PropTypes.bool,
  saveOnChange: PropTypes.bool,
  noValidator: PropTypes.bool,
  inputProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    placeholder: PropTypes.node.isRequired,
    style: PropTypes.objectOf(PropTypes.any),
    multiline: PropTypes.bool,
    disabled: PropTypes.bool,
  }).isRequired,
};

TextInput.defaultProps = {
  currentValue: '',
  autocomplete: '',
  rows: 1,
  info: '',
  number: false,
  decimal: false,
  money: false,
  inputStyle: undefined,
  floatingLabelFixed: true,
  saveOnChange: true,
  noValidator: false,
};

export default TextInput;
