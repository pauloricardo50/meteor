import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '/imports/ui/components/general/IconButton';
import classnames from 'classnames';

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
      noDelete,
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
      <span>
        <TextInput
          style={this.getStyles()}
          name={id}
          id={id}
          value={zeroAllowed ? val : val || ''}
          onChange={setFormState}
          onBlur={() => setActiveLine('')}
          placeholder={placeholder}
          autoFocus={autoFocus}
          pattern={number && '[0-9]*'}
          inputRef={setRef}
          type={type}
        />

        {!!(!text2 && !noDelete && !array) && (
          <div className={classnames({ 'delete-button': true, off: !val })}>
            <div className="absolute-wrapper">
              <IconButton
                type="close"
                onClick={() => {
                  setFormState(id, '');
                  if (inputRef) {
                    inputRef.focus();
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
  inputRef: PropTypes.any,
  text2: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  array: PropTypes.bool,
  noDelete: PropTypes.bool,
};

StartTextField.defaultProps = {
  money: false,
  placeholder: '',
  label: undefined,
  autoFocus: false,
  zeroAllowed: false,
  setRef: () => null,
  inputRef: undefined,
  text2: '',
  array: false,
  noDelete: false,
};
