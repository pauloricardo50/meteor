import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DatePicker from '../DateInput/DatePicker';
import AutoFormTextInput from './AutoFormTextInput';

class AutoFormDateInput extends Component {
  constructor() {
    super();
    this.state = { focused: false };
  }

  render() {
    const { InputProps } = this.props;
    const { focused } = this.state;

    return (
      <AutoFormTextInput
        {...this.props}
        showValidIconOnChange
        savingIconStyle={{ top: 10 }}
        inputComponent={DatePicker}
        InputProps={{
          ...InputProps,
          inputProps: {
            onFocusChange: ({ focused: nextFocused }) =>
              this.setState({ focused: nextFocused }),
            focused,
          },
          placeholder: null,
          notched: true,
          date: true,
        }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }
}

AutoFormDateInput.propTypes = {
  docId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  maxDate: PropTypes.objectOf(PropTypes.any),
  minDate: PropTypes.objectOf(PropTypes.any),
  openDirection: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  updateFunc: PropTypes.string.isRequired,
};

AutoFormDateInput.defaultProps = {
  maxDate: undefined,
  minDate: undefined,
  style: {},
  openDirection: undefined,
};

export default AutoFormDateInput;
