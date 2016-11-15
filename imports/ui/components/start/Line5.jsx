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

export default class Line5 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      salary: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }


  setCompleted() {
    const s = this.state;
    if (s.salary) {
      this.props.completeStep(null, true);
    }
  }


  handleChange(event) {
    Meteor.clearTimeout(timer);

    this.setState({
      salary: toMoney(event.target.value),
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
          Le total de
          {this.props.twoBuyers ? ' nos ' : ' mes '}
          revenus brut est de CHF&nbsp;
          <TextField
            style={styles.textField}
            name="salary"
            value={this.state.salary}
            onChange={this.handleChange}
            pattern="[0-9]*"
            autoFocus
          />
          &nbsp;par an
        </h1>
      </article>
    );
  }
}

Line5.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
