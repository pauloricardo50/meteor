import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import TextField from 'material-ui/TextField';

import { toMoney, toNumber } from '/imports/js/finance-math.js';

const styles = {
  textField: {
    width: 150,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
};

var timer;

export default class Line5 extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }


  setCompleted() {
    if (this.props.salary) {
      this.props.completeStep(null, true);
    }
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.props.setStateValue(
      'salary',
      String(toNumber(event.target.value)),
      () => {
        // Use a quick timeout to allow user to type in more stuff before going to next step
        timer = Meteor.setTimeout(() => {
          this.setCompleted();
        }, 400);
      }
    );
  }


  render() {
    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          Le total de
          {this.props.twoBuyers ? ' nos ' : ' mes '}
          revenus brut est de
          <TextField
            style={styles.textField}
            name="salary"
            value={`CHF ${toMoney(this.props.salary)}`}
            onChange={this.handleChange}
            pattern="[0-9]*"
            autoFocus
          />
          par an
        </h1>
      </article>
    );
  }
}

Line5.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  salary: PropTypes.string.isRequired,
};
