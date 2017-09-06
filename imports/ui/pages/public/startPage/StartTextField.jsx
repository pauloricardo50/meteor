import PropTypes from 'prop-types';
import React from 'react';

import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import CloseIcon from 'material-ui/svg-icons/navigation/close';
import classnames from 'classnames';

import { swissFrancMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';

export default class StartTextField extends React.Component {
  getStyles() {
    let width;
    if (this.props.money) {
      width = 190;
    } else if (!this.props.width) {
      width = 165;
    }

    return {
      width: this.props.width || width,
      fontSize: 'inherit',
      marginLeft: 8,
      marginRight: 8,
      color: 'inherit',
    };
  }

  handleChange(event) {
    // Save a Number if it is money, else the string
    const value = this.props.money ? toNumber(event.target.value) : event.target.value;
    this.props.setFormState(this.props.id, value);
  }

  render() {
    const val = this.props.value || this.props.formState[this.props.id];

    return (
      <span style={{ position: 'relative' }}>
        <TextField
          style={this.getStyles()}
          name={this.props.id}
          value={this.props.zeroAllowed ? val : val || ''}
          onChange={e => this.handleChange(e, false)}
          onBlur={() => this.props.setActiveLine('')}
          hintText={this.props.placeholder || (this.props.money ? 'CHF' : '')}
          autoFocus={this.props.autoFocus}
          pattern={this.props.number && '[0-9]*'}
          ref={c => this.props.setRef(c)}
        >
          {this.props.money &&
            <MaskedInput
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
              autoFocus={this.props.autoFocus}
              value={this.props.zeroAllowed ? val : val || ''}
            />}
        </TextField>

        {!this.props.text2 &&
          !this.props.multiple &&
          !this.props.array &&
          <div className={classnames({ 'delete-button': true, off: !val })}>
            <div className="absolute-wrapper">
              <CloseIcon
                onClick={() => {
                  this.props.setFormState(this.props.id, '');
                  if (this.props.inputRef) {
                    this.props.inputRef.input.inputElement.focus();
                  }
                }}
                disabled={!val}
              />
            </div>
          </div>}
      </span>
    );
  }
}

StartTextField.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setFormState: PropTypes.func.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  money: PropTypes.bool,
  number: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  autoFocus: PropTypes.bool,
  zeroAllowed: PropTypes.bool,
  setRef: PropTypes.func,
  multiple: PropTypes.bool,
  inputRef: PropTypes.any,
  text2: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  array: PropTypes.bool,
};

StartTextField.defaultProps = {
  money: false,
  placeholder: '',
  label: undefined,
  autoFocus: false,
  zeroAllowed: false,
  setRef: () => null,
  multiple: false,
  inputRef: undefined,
  text2: '',
  array: false,
};
