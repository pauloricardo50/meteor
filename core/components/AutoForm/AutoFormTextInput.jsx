import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import colors from '../../config/colors';
import * as constants from '../../config/constants';
import {
  toDecimalNumber,
  toNegativeNumber,
  toNumber,
} from '../../utils/conversionFunctions';
import MyTextInput from '../TextInput';
import ValidIcon from './ValidIcon';

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

const cleanValue = v => (v === 0 ? 0 : v || '');

const isEqual = (value, currentValue, type) => {
  if (type === 'date') {
    // To avoid the saving icon from firing twice when chaning the date,
    // only compare the date without times
    // If we ever have date inputs in autoform that need time, we'll have to find another hack

    return moment(value).isSame(currentValue, 'day');
  }

  return value === cleanValue(currentValue);
};

class AutoFormTextInput extends Component {
  constructor(props) {
    super(props);

    const { currentValue, number, decimal, negative } = props.inputProps;

    this.state = {
      // Make sure 0 values are displayed properly
      value: cleanValue(currentValue),
      errorText: '',
      saving: false,
      showInfo: false,
      history: [cleanValue(currentValue)],
    };

    if (number) {
      if (decimal) {
        this.formatter = toDecimalNumber;
      } else if (negative) {
        this.formatter = toNegativeNumber;
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

  UNSAFE_componentWillReceiveProps(nextProps) {
    const valueIsDifferent =
      nextProps.inputProps.currentValue !== this.props.inputProps.currentValue;
    if (valueIsDifferent) {
      // To handle race conditions, check if the new value from the DB
      // has been typed in the past
      // If it has, then don't update the textfield
      // If it hasn't, override it, because the backend says it should be a new value
      const valueExistsInHistory = this.state.history.includes(
        nextProps.inputProps.currentValue,
      );

      if (!valueExistsInHistory) {
        this.handleChange(nextProps.inputProps.currentValue);
      }
    }
  }

  handleBlur = () => {
    this.setState({ showInfo: false });
    // If the value has changed, save it
    // state is initialized as '', but currentValue is initially undefined, so check that too
    this.saveValue(true);
  };

  handleChange = value => {
    const {
      saveOnChange,
      showValidIconOnChange,
      inputProps: { currentValue, inputType },
    } = this.props;

    // Make sure value is a number if this is a number or money input
    // const safeValue =
    //   this.props.number || this.props.money
    //     ? toNumber(event.target.value)
    //     : event.target.value;

    if (isEqual(value, currentValue, inputType)) {
      return;
    }

    this.setState(
      ({ history }) => ({ value, history: [...history, value] }),
      () => {
        // do not show saving icon when changing text, only show it on blur
        if (saveOnChange) {
          this.saveValue(showValidIconOnChange);
        }
      },
    );
  };

  handleFocus = () => {
    this.setState({ showInfo: true });
  };

  saveValue = showSaving => {
    const {
      updateFunc,
      docId,
      inputProps: { id, currentValue, inputType },
    } = this.props;
    const { value } = this.state;

    // Save data to DB
    const object = { [id]: value };
    let shouldSave = true;

    // Don't save if value hasn't changed
    if (isEqual(value, currentValue, inputType)) {
      shouldSave = false;
    }

    Meteor.clearTimeout(this.timeout);
    this.timeout = Meteor.setTimeout(() => {
      Promise.resolve()
        .then(() => shouldSave && updateFunc({ object, id: docId }))
        // on success, set saving briefly to true, before setting it to false again to trigger icon
        .then(() => this.setState({ errorText: '', saving: showSaving }))
        // If there was an error, reset value to the backend value
        .catch(() => this.setState({ value: currentValue }))
        .finally(() => this.setState({ saving: false }));
    }, constants.AUTOSAVE_DEBOUNCE);
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
        onFocusChange,
        focused,
        todo,

        // Destructure these props to avoid warnings
        inputRef,
        currentValue,
        condition,
        decimal,
        intlId,
        saveOnChange,
        inputLabelProps,

        ...otherProps
      },
      inputLabelProps: inputLabelPropsOverride,
      savingIconStyle,
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
          InputProps={{ onFocusChange, focused }}
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
          inputLabelProps={inputLabelPropsOverride || inputLabelProps}
        />
        <ValidIcon
          saving={saving}
          error={!!errorText}
          style={{ ...styles.savingIcon, ...savingIconStyle }}
          value={value}
          required={required}
          hide={admin}
          todo={todo}
        />
      </div>
    );
  }
}

AutoFormTextInput.propTypes = {
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
  number: PropTypes.bool,
  rows: PropTypes.number,
  saveOnChange: PropTypes.bool,
  savingIconStyle: PropTypes.object,
  showValidIconOnChange: PropTypes.bool,
  updateFunc: PropTypes.func,
};

AutoFormTextInput.defaultProps = {
  autocomplete: '',
  currentValue: '',
  decimal: false,
  floatingLabelFixed: true,
  info: '',
  inputStyle: undefined,
  money: false,
  number: false,
  rows: 1,
  saveOnChange: true,
  savingIconStyle: {},
  showValidIconOnChange: false,
};

export default AutoFormTextInput;
