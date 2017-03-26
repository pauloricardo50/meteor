import React, { Component, PropTypes } from 'react';

import StartTextField from './StartTextField.jsx';
import StartSelectField from './StartSelectField.jsx';
import StartSlider from './StartSlider.jsx';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

export default class Input extends Component {
  render() {
    const currentValue = this.props.formState[this.props.id];

    return (
      <article
        className={this.props.className}
        onTouchTap={() => {
          this.props.setActiveLine(this.props.id);
          if (this.props.money && this.props.text) {
            this.input.input.inputElement.focus();
          } else if (this.props.text) {
            this.input.focus();
          }
        }}
      >

        <h1 className="fixed-size">
          {this.props.text1}
          &nbsp;

          {this.props.question && <br />}

          <span className="active">
            {this.props.text &&
              <StartTextField
                {...this.props}
                setRef={c => {
                  this.input = c;
                }}
              />}

            {this.props.select && <StartSelectField {...this.props} />}

            {this.props.slider &&
              <span>
                {this.props.money
                  ? `CHF ${toMoney(currentValue) || toMoney(this.props.sliderMin)}`
                  : currentValue}
              </span>}
            {this.props.slider && <br />}
            {this.props.slider && <StartSlider {...this.props} />}
          </span>

          {this.props.text2}
        </h1>

      </article>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
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
