import PropTypes from 'prop-types';
import React, { Component } from 'react';

import StartTextField from './StartTextField.jsx';
import StartSelectField from './StartSelectField.jsx';
import StartSlider from './StartSlider.jsx';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

const Input = props => {
  const currentValue = props.formState[props.id];

  return (
    <article
      className={props.className}
      onTouchTap={() => {
        props.setActiveLine(props.id);
        if (props.money && props.text) {
          this.input.input.inputElement.focus();
        } else if (props.text) {
          this.input.focus();
        }
      }}
    >

      <h1 className="fixed-size">
        {props.text1}
        &nbsp;

        {props.question && <br />}

        <span className="active">
          {props.text &&
            <StartTextField
              {...props}
              setRef={c => {
                this.input = c;
              }}
            />}

          {props.select && <StartSelectField {...props} />}

          {props.slider &&
            <span>
              {props.money
                ? `CHF ${toMoney(currentValue) || toMoney(props.sliderMin)}`
                : currentValue}
            </span>}
          {props.slider && <br />}
          {props.slider && <StartSlider {...props} />}
        </span>

        {props.text2}
      </h1>

    </article>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text2: PropTypes.string,
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  question: PropTypes.bool,
  text: PropTypes.bool,
  select: PropTypes.bool,
  slider: PropTypes.bool,
  money: PropTypes.bool,
};

Input.defaultProps = {
  text2: undefined,
  money: false,
  question: false,
  text: false,
  select: false,
  slider: false,
};

export default Input;
