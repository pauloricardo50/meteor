import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import * as constants from '../../config/constants';
import colors from '../../config/colors';
import { toNumber, toDecimalNumber } from '../../utils/conversionFunctions';
import MyTextInput from '../TextInput';
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
    this.saveValue(true);
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

  saveValue = (showSaving) => {
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
        // on success, set saving briefly to true, before setting it to false again to trigger icon
        .then(() => this.setState({ errorText: '', saving: showSaving }))
        // If there was an error, reset value to the backend value
        .catch(() => this.setState({ value: currentValue }))
        .finally(() => this.setState({ saving: false }));
    }, constants.CHARACTERS_TYPES_PER_SECOND_AVG);
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
        date,
        percent,

        // Destructure these props to avoid warnings
        inputRef,
        currentValue,
        condition,
        decimal,
        intlId,
        saveOnChange,

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
    } else if (date) {
      type = 'date';
    } else if (percent) {
      type = 'percent';
    } else {
      type = 'text';
    }

    return (
      <div className="form-input__row" style={{ ...styles.div, ...style }}>
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
  autocomplete: PropTypes.string,
  currentValue: PropTypes.any,
  decimal: PropTypes.bool,
  docId: PropTypes.string.isRequired,
  floatingLabelFixed: PropTypes.bool,
  info: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  inputProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    placeholder: PropTypes.node.isRequired,
    style: PropTypes.objectOf(PropTypes.any),
    multiline: PropTypes.bool,
    disabled: PropTypes.bool,
  }).isRequired,
  inputStyle: PropTypes.objectOf(PropTypes.any),
  money: PropTypes.bool,
  noValidator: PropTypes.bool,
  number: PropTypes.bool,
  rows: PropTypes.number,
  saveOnChange: PropTypes.bool,
  updateFunc: PropTypes.func,
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
