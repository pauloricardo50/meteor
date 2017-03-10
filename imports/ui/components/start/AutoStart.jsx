import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import ButtonInput from './ButtonInput.jsx';
import Input from './Input.jsx';
import MultipleInput from './MultipleInput.jsx';
import ArrayInput from './ArrayInput.jsx';


const isFalse = v => v === undefined; // || v === '';


export default class AutoStart extends Component {
  constructor(props) {
    super(props);

    this.renderedArray = [];
    this.scrolled = {};
  }


  verifyConditions(input, index, array) {
    // Get previous input
    const prevInput = array[index - 1];


    if (index === 0) {
      return true;
    } else if (prevInput && prevInput.final === true) {
      // Check if the previous input was a final value, stop form except if it is hidden
      if (prevInput.hide) {
        return true;
      }
      return 'break';
    } else if (input.condition === false) {
      // If a condition is specified and false
      return false;
    } else if (prevInput.type === 'multipleInput') {
      // If previous input has multiple values, verify both aren't undefined
      if (prevInput.condition === false && !prevInput.normalFlow) {
        this.scroll(input.id);
        return true;
      } else if (this.props.formState.borrowerCount > 1 &&
        (isFalse(this.props.formState[`${prevInput.id}1`]) ||
        isFalse(this.props.formState[`${prevInput.id}2`]))
      ) {
        return 'break';
      } else if (isFalse(this.props.formState[`${prevInput.id}1`])) {
        return 'break';
      }
    } else if (input.condition === undefined) {
      // If no condition is provided, only show this input if previous value is valid
      // TODO verify if it is valid
      if (isFalse(this.props.formState[prevInput.id])) {
        return 'break';
      }
    }

    this.scroll(input.id);
    return true;
  }


  inputSwitch(input, index, array) {
    if (this.breakForm) {
      return null;
    }

    const verified = this.verifyConditions(input, index, array);
    if (verified === 'break') {
      this.breakForm = true;
    } else if (verified) {
      this.renderedArray.push(input);

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

    return (
      <section style={{ width: '100%', display: 'inline-block' }}>
        <div className="col-sm-10 col-sm-offset-1">
          {this.props.formArray.map((input, index, array) => this.inputSwitch(input, index, array))}
        </div>
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
