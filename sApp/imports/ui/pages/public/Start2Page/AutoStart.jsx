import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import classnames from 'classnames';

import { T } from 'core/components/Translation';
import { trackOncePerSession } from '/imports/js/helpers/analytics';
import ButtonInput from 'core/components/ButtonInput';
import Input from './Input';
import MultipleInput from './MultipleInput';
import StartArrayInput from './StartArrayInput';

// Verify if the previous value is false
const isFalse = (val, zeroAllowed = false) =>
  (zeroAllowed
    ? val === undefined || val === ''
    : val === undefined || val === 0 || val === '');

const validationCheck = (v, rules) =>
  (!rules.min || v >= rules.min) && (!rules.max || v <= rules.max);

export const arrayIsTrue = (arr, keys) =>
  (arr && arr.length) >= 1 &&
  arr.every(arrayItem =>
    keys.reduce((tot, key) => tot && arrayItem[key] !== undefined, true),
  );

const prevTrue = (prev, s) => {
  if (prev.type === 'multipleInput') {
    if (
      s.borrowerCount > 1 &&
      (isFalse(s[`${prev.id}1`], prev.zeroAllowed) ||
        isFalse(s[`${prev.id}2`], prev.zeroAllowed))
    ) {
      return false;
    } else if (isFalse(s[`${prev.id}1`], prev.zeroAllowed)) {
      return false;
    }
  } else if (prev.type === 'buttons' && s[prev.id] === undefined) {
    // For buttons, only check if they are undefined
    return false;
  } else if (
    prev.type === 'arrayInput' &&
    !arrayIsTrue(s[prev.id], prev.inputs.map(i => i.id))
  ) {
    return false;
  } else if (prev.type === 'custom') {
    return prev.validation();
  } else if (
    (prev.validation !== undefined &&
      !validationCheck(s[prev.id], prev.validation)) ||
    isFalse(s[prev.id], prev.zeroAllowed)
  ) {
    return false;
  }

  return true;
};

export default class AutoStart extends Component {
  constructor(props) {
    super(props);

    this.renderedArray = [];
    this.scrolled = {};
  }

  componentDidUpdate() {
    // Make sure the whole form stops if an error is displayed
    if (this.error && !this.props.formState.error) {
      this.props.setFormState('error', true);
      // Stop scrolling for ever if there is an error, to allow user to correct his inputs
      this.props.setFormState('stopScroll', true);
    } else if (!this.error && this.props.formState.error) {
      this.props.setFormState('error', false);
    }
  }

  inputSwitch(input, index) {
    // Stop iterating over array when form is currently in 'break' mode
    if (this.breakForm) {
      return null;
    }

    const verified = this.verifyConditions(input);

    if (verified === 'break') {
      this.breakForm = true;
    } else if (verified) {
      this.renderedArray.push(input);
      this.scroll(input.id);

      const prevInput =
        this.renderedArray.length > 1 &&
        this.renderedArray[this.renderedArray.length - 2];

      const active = this.props.formState.activeLine === input.id;
      // Set props to pass to each input
      const inputProps = {
        ...input,
        formState: { ...this.props.formState },
        index,
        key: index,
        setFormState: this.props.setFormState,
        setActiveLine: this.props.setActiveLine,
        active,
        className: classnames({
          startArticle: true,
          activeLine: active,
          last: input.id === 'finalized',
          slider: input.type === 'sliderInput',
        }),
        autoFocus:
          prevInput.type === 'buttons' &&
          this.props.formState.lastModified === prevInput.id &&
          !this.props.formState.stopScroll &&
          !this.props.formState.finalized,
        // If text1 is specified, use it, otherwise use the id to get the string
        // arrayInputs don't have a description, so ignore it and use undefined
        text1:
          input.text1 !== undefined || input.type === 'arrayInput' ? (
            input.text1
          ) : (
            <T id={`Start2Form.${input.id}`} values={input.intlValues} />
          ),
        text2:
          input.text2 === true ? (
            <T id={`Start2Form.${input.id}2`} values={input.intlValues2} />
          ) : (
            undefined
          ),
      };

      const scrollingInput = () => {
        switch (input.type) {
          case 'buttons':
            return <ButtonInput {...inputProps} />;
          case 'textInput':
            return <Input {...inputProps} text />;
          case 'multipleInput':
            return <MultipleInput {...inputProps} />;
          case 'selectInput':
            return <Input {...inputProps} select />;
          case 'sliderInput':
            return <Input {...inputProps} slider />;
          case 'arrayInput':
            return <StartArrayInput {...inputProps} />;
          case 'custom': {
            const Tag = input.component;
            return <Tag {...inputProps} />;
          }
          default:
            throw new Error('Not a valid AutoForm type');
        }
      };

      return (
        <Scroll.Element
          name={input.id}
          key={input.id}
          className="scroll fadeInUpCustom"
        >
          {scrollingInput()}
        </Scroll.Element>
      );
    }
  }

  scroll(id) {
    if (!this.props.formState.stopScroll && !this.scrolled[id]) {
      const options = {
        duration: 350,
        delay: 0,
        smooth: true,
        ignoreCancelEvents: true,
      };
      Meteor.defer(() => Scroll.scroller.scrollTo(id, options));

      // create a list of scrolled values, if it has already been scrolled once, do not do it again
      this.scrolled[id] = true;
    }
  }

  verifyConditions(input) {
    // Get previous input
    const prevInput = this.renderedArray[this.renderedArray.length - 1] || {};

    if (this.renderedArray.length === 0) {
      return !input.hasOwnProperty('condition') || input.condition;
    } else if (prevInput.final) {
      // Break if the previous input is final
      return 'break';
    } else if (prevInput.error === true) {
      // If an error ever appears, start error mode (prevent any further rendering)
      this.error = true;
      trackOncePerSession('AutoStart - startForm error', {
        errorId: prevInput.id,
      });
      return 'break';
    } else if (!prevTrue(prevInput, this.props.formState)) {
      // Make sure previous input is valid before continuing
      return 'break';
    } else if (input.condition === false) {
      // Skip inputs whose condition is false
      return false;
    }

    return true;
  }

  render() {
    // Reinitialize the renderedArray
    this.renderedArray = [];
    this.breakForm = false;
    this.error = false;

    return (
      <section>
        {this.props.formArray.map((input, index) =>
          this.inputSwitch(input, index),
        )}
      </section>
    );
  }
}

AutoStart.propTypes = {
  formArray: PropTypes.arrayOf(PropTypes.any).isRequired,
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setFormState: PropTypes.func.isRequired,
  setActiveLine: PropTypes.func.isRequired,
};
