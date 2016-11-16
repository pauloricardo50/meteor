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

export default class Line8b extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fortune: '',
      insuranceFortune: '',
    };

    this.handleFortuneChange = this.handleFortuneChange.bind(this);
    this.handleInsuranceFortuneChange = this.handleInsuranceFortuneChange.bind(this);
  }


  setCompleted() {
    if (this.state.insuranceFortune) {
      this.props.completeStep(null, true);
    }
  }


  handleFortuneChange(event) {
    Meteor.clearTimeout(timer);

    this.setState({
      fortune: toNumber(event.target.value),
    });
  }

  handleInsuranceFortuneChange(event) {
    Meteor.clearTimeout(timer);

    this.setState({
      insuranceFortune: toNumber(event.target.value),
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

          <span>
            {this.props.twoBuyers ? 'Nous avons ' : 'J\'ai '}
            à disposition&nbsp;
            <TextField
              style={styles.textField}
              name="fortune"
              value={`CHF ${toMoney(this.state.fortune)}`}
              onChange={this.handleFortuneChange}
              pattern="[0-9]*"
              autoFocus
            />
            &nbsp;de fortune personelle
          </span>
          {/* Once some bit of fortune has been entered, show the rest of the sentence */}
          {this.state.fortune ?
            <span>
              &nbsp;et
              <TextField
                style={styles.textField}
                name="insuranceFortune"
                value={`CHF ${toMoney(this.state.insuranceFortune)}`}
                onChange={this.handleInsuranceFortuneChange}
                pattern="[0-9]*"
              />
              de 2ème pilier.
            </span>
            : null
          }
        </h1>
      </article>
    );
  }
}

Line8b.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  twoBuyers: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
};
