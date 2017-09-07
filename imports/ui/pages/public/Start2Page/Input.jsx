import PropTypes from 'prop-types';
import React, { Component } from 'react';

import AutoTooltip from '/imports/ui/components/general/AutoTooltip';
import StartTextField from './StartTextField';
import StartSelectField from './StartSelectField';
import StartSlider from './StartSlider';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

export default class Input extends Component {
  render() {
    const currentValue = this.props.formState[this.props.id];

    return (
      <article
        className={this.props.className}
        onClick={() => {
          this.props.setActiveLine(this.props.id);
          if (this.props.money && this.props.text) {
            this.input.input.inputElement.focus();
          } else if (this.props.text) {
            this.input.focus();
          }
        }}
      >

        <h1 className="fixed-size">
          <AutoTooltip>{this.props.text1}</AutoTooltip>
          &nbsp;

          {this.props.question && <br />}

          <span className="active">
            {this.props.text &&
              <StartTextField
                {...this.props}
                setRef={c => {
                  this.input = c;
                }}
                inputRef={this.input}
              />}

            {this.props.select && <StartSelectField {...this.props} />}

            {this.props.slider &&
              <span>
                {this.props.child1}
                {this.props.child1 === null &&
                  (this.props.money
                    ? `CHF ${toMoney(currentValue) || toMoney(this.props.sliderMin)}`
                    : currentValue)}
              </span>}
            {this.props.slider && this.props.child1 === null && <br />}
            {this.props.slider && <StartSlider {...this.props} />}
          </span>

          <AutoTooltip>{this.props.text2}</AutoTooltip>
        </h1>

      </article>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text2: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  question: PropTypes.bool,
  text: PropTypes.bool,
  select: PropTypes.bool,
  slider: PropTypes.bool,
  money: PropTypes.bool,
  child1: PropTypes.element,
};

Input.defaultProps = {
  text2: undefined,
  money: false,
  question: false,
  text: false,
  select: false,
  slider: false,
  child1: null,
};
