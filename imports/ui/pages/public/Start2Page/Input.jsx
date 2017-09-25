import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { IntlNumber } from '/imports/ui/components/general/Translation';
import StartTextField from './StartTextField';
import StartSelectField from './StartSelectField';
import StartSlider from './StartSlider';

// Keep a Component because of input refs
export default class Input extends Component {
  render() {
    const {
      formState,
      id,
      className,
      setActiveLine,
      money,
      text,
      text1,
      text2,
      focus,
      question,
      select,
      slider,
      child1,
      sliderMin,
    } = this.props;
    const currentValue = formState[id];

    return (
      <article
        className={className}
        onClick={() => {
          setActiveLine(id);
          if (money && text) {
            this.input.input.inputElement.focus();
          } else if (text) {
            this.input.focus();
          }
        }}
      >
        <h1 className="fixed-size">
          {text1} {question && <br />}
          <span className="active">
            {text && (
              <StartTextField
                {...this.props}
                setRef={(c) => {
                  this.input = c;
                }}
                inputRef={this.input}
              />
            )}

            {select && <StartSelectField {...this.props} />}

            {slider && (
              <span>
                {child1 !== null ? (
                  child1
                ) : (
                  <IntlNumber
                    value={currentValue || sliderMin}
                    format={money ? 'money' : ''}
                  />
                )}
              </span>
            )}
            {slider && child1 === null && <br />}
            {slider && <StartSlider {...this.props} />}
          </span>
          {text2}
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
