import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';


import Line9Sliders from './Line9Sliders.jsx';

var timer;

export default class Line9 extends Component {
  constructor(props) {
    super(props);

    // Set the initial fortune values based on the choice in line 8, sum of both has to be 20%
    if (this.props.maxCash) {
      this.state = {
        fortune: Math.round(this.props.propertyValue * 0.2),
        insuranceFortune: 0,
      };
    } else {
      this.state = {
        fortune: Math.round(this.props.propertyValue * 0.1),
        insuranceFortune: Math.round(this.props.propertyValue * 0.1),
      };
    }
  }

  changeFortune(value, isPercent, isSlider) {
    this.setState({
      fortune: (isPercent ? Math.round(value * this.props.propertyValue) : value),
    },
      function () {
        this.adjustValues(true, isSlider);
      }.bind(this)
    );
  }

  changeInsuranceFortune(value, isPercent, isSlider) {
    this.setState({
      insuranceFortune: (isPercent ? Math.round(value * this.props.propertyValue) : value),
    },
      function () {
        this.adjustValues(false, isSlider);
      }.bind(this)
    );
  }

  adjustValues(isFortune, isSlider) {
    const that = this;
    if (isSlider) {
      that.adjustValuesFunc(isFortune, that);
    } else {
      Meteor.clearTimeout(timer);

      // If this isn't a slider, wait for 500ms before auto adjusting the other value
      timer = Meteor.setTimeout(function () {
        that.adjustValuesFunc(isFortune, that);
      }, 500);
    }
  }

  adjustValuesFunc(isFortune, that) {
    const f = that.state.fortune;
    const i = that.state.insuranceFortune;
    const p = that.props.propertyValue;

    // Make sure fortune is always at least 10%, and set insurance to 10% as well
    if (f < 0.1 * p) {
      that.setState({
        fortune: Math.round(0.1 * p),
        insuranceFortune: Math.round(0.1 * p),
      });
    } else if (f + i < 0.2 * p) {
      // If both fortunes combined aren't at least 20% of the propertyValue
      // Set the other value to be the rest
      if (isFortune) {
        that.setState({ insuranceFortune: Math.round((0.2 * p) - f) });
      } else {
        that.setState({ fortune: Math.round((0.2 * p) - i) });
      }
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep} className={this.props.classes.text}>
        <Line9Sliders
          fortune={this.state.fortune}
          insuranceFortune={this.state.insuranceFortune}
          propertyValue={this.props.propertyValue}
          changeFortune={
            (value, isPercent, isSlider) => this.changeFortune(value, isPercent, isSlider)
          }
          changeInsuranceFortune={
            (value, isPercent, isSlider) => this.changeInsuranceFortune(value, isPercent, isSlider)
          }
        />
        {this.props.step === 8 ?
          <div className="text-center col-xs-12">
            <RaisedButton
              label="Je suis satisfait"
              onClick={e => this.props.completeStep(e, true)}
              primary
            />
          </div>
          : null
        }
      </article>
    );
  }
}

Line9.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  maxCash: PropTypes.bool.isRequired,
  propertyValue: PropTypes.number.isRequired,
  completeStep: PropTypes.func.isRequired,
};
