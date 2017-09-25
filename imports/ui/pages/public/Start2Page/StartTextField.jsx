import PropTypes from 'prop-types';
import React from 'react';

import TextField from '/imports/ui/components/general/Material/TextField';
import MaskedInput from 'react-text-mask';

import IconButton from '/imports/ui/components/general/IconButton';
import classnames from 'classnames';

import { swissFrancMask } from '/imports/js/helpers/textMasks';
import { toNumber } from '/imports/js/helpers/conversionFunctions';

import TextInput from '/imports/ui/components/general/TextInput';

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

  render() {
    const {
      value,
      formState,
      setFormState,
      id,
      money,
      number,
      zeroAllowed,
      setActiveLine,
      placeholder,
      autoFocus,
      setRef,
      text2,
      multiple,
      array,
      inputRef,
    } = this.props;

    const val = value || formState[id];
    let type;
    if (money) {
      type = 'money';
    } else if (number) {
      type = 'number';
    } else {
      type = 'text';
    }

    return (
      <span style={{ position: 'relative' }}>
        <TextInput
          style={this.getStyles()}
          name={id}
          id={id}
          value={zeroAllowed ? val : val || ''}
          handleChange={setFormState}
          onBlur={() => setActiveLine('')}
          placeholder={placeholder}
          autoFocus={autoFocus}
          pattern={number && '[0-9]*'}
          ref={c => setRef(c)}
          type={type}
        >
          {/* {this.props.money && (
            <MaskedInput
              mask={swissFrancMask}
              guide
              pattern="[0-9]*"
              autoFocus={this.props.autoFocus}
              value={this.props.zeroAllowed ? val : val || ''}
            />
          )} */}
        </TextInput>

        {!!(!text2 && !multiple && !array) && (
          <div className={classnames({ 'delete-button': true, off: !val })}>
            <div className="absolute-wrapper">
              <IconButton
                type="close"
                onClick={() => {
                  setFormState(id, '');
                  if (inputRef) {
                    inputRef.input.inputElement.focus();
                  }
                }}
                disabled={!val}
              />
            </div>
          </div>
        )}
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
