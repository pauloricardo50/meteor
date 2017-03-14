import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import ButtonInput from './ButtonInput.jsx';
import Input from './Input.jsx';
import MultipleInput from './MultipleInput.jsx';
import ArrayInput from './ArrayInput.jsx';


// Verify if the previous value is false
const isFalse = (val, zeroAllowed = false) =>
  (zeroAllowed ? (val === undefined || val === '') : (val === undefined || val === 0 || val === ''));

const validationCheck = (v, rules) => (!rules.min || v >= rules.min) && (!rules.max || v <= rules.max);

const arrayIsTrue = (a, keys) =>
  (a && a.length) >= 1 && keys.reduce((tot, key) => tot && a[0][key] !== undefined, true);

const prevFalse = (prev, s) => {
  if (prev.type === 'multipleInput') {
    if (s.borrowerCount > 1 &&
      (isFalse(s[`${prev.id}1`], prev.zeroAllowed) ||
      isFalse(s[`${prev.id}2`], prev.zeroAllowed))
    ) {
      return true;
    } else if (isFalse(s[`${prev.id}1`], prev.zeroAllowed)) {
      return true;
    }
  } else if (prev.type === 'buttons' && s[prev.id] === undefined) {
    // For buttons, only check if they are undefined
    return true;
  } else if (prev.type === 'arrayInput' &&
    !arrayIsTrue(s[prev.id], prev.inputs.map(i => i.id))) {
    return true;
  } else if ((prev.validation !== undefined && !validationCheck(s[prev.id], prev.validation)) ||
    isFalse(s[prev.id], prev.zeroAllowed)
  ) {
    return true;
  }

  return false;
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
    } else if (!this.error && this.props.formState.error) {
      this.props.setFormState('error', false);
    }
  }


  verifyConditions(input) {
    // Get previous input
    const prevInput = this.renderedArray[this.renderedArray.length - 1] || {};

    if (this.renderedArray.length === 0 && input.condition) {
      // Always display the first input
      return true;
    } else if (prevInput.final || prevInput.type === 'error') {
      // Break if the previous input is final or an error
      return 'break';
    } else if (prevFalse(prevInput, this.props.formState)) {
      // Make sure previous input is valid before continuing
      return 'break';
    } else if (input.condition === false) {
      // Skip inputs whose condition is false
      return false;
    }

    return true;
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

      // const prevInput = index > 0 && array[index - 1];
      const prevInput = this.renderedArray.length > 1 &&
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
        className: active ? 'startArticle activeLine' : 'startArticle',
        autoFocus: prevInput.type === 'buttons',
      };


      const scrollingInput = () => {
        switch (input.type) {
          case 'buttons':
            return (<ButtonInput {...inputProps} />);
          case 'textInput':
            return (<Input {...inputProps} text />);
          case 'multipleInput':
            return (<MultipleInput {...inputProps} />);
          case 'selectInput':
            return (<Input {...inputProps} select />);
          case 'arrayInput':
            return (<ArrayInput {...inputProps} />);
          default:
            throw new Error('Not a valid AutoForm type');
        }
      };

      return (
        <Scroll.Element
          name={input.id}
          key={input.id}
          className="scroll"
        >
          {scrollingInput()}
        </Scroll.Element>
      );
    }
  }

  scroll(id) {
    if (!this.scrolled[id]) {
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


  render() {
    // Reinitialize the renderedArray
    this.renderedArray = [];
    this.breakForm = false;
    this.error = false;

    return (
      <section>
        {this.props.formArray.map((input, index, array) => this.inputSwitch(input, index, array))}
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
