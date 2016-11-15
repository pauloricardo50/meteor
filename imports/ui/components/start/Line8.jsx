import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import TextField from 'material-ui/TextField';


import { toMoney } from '/imports/js/finance-math.js';


const styles = {
  textField: {
    width: 100,
    fontSize: 'inherit',
  },
};

var timer;

export default class Line8 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fortune: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }


  // If salary was completed, ask for a bonus
  setCompleted() {
    const s = this.state;
    if (s.fortune) {
      this.props.completeStep(null, true);
    }
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.setState({
      fortune: toMoney(event.target.value),
    }, function () {
      // Use a quick timeout to allow user to type in more stuff before going to next step
      const that = this;
      timer = Meteor.setTimeout(function () {
        that.setCompleted();
      }, 400);
    });
  }


  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          {this.props.twoBuyers ? 'et nous avons ' : 'et j\'ai '}
          à disposition une fortune de CHF
          <TextField
            style={styles.textField}
            name="fortune"
            value={this.state.fortune}
            onChange={this.handleChange}
          />
          &nbsp;ainsi que mon 2ème pilier
        </h1>
      </article>
    );
  }
}

Line8.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  propertyValue: PropTypes.number.isRequired,
};
