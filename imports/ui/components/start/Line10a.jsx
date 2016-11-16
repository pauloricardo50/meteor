import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';


import Line10aSliders from './Line10aSliders.jsx';

var timer;

export default class Line10a extends Component {
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

  componentWillReceiveProps(nextProps) {
    const oldMaxCash = this.props.maxCash;

    if (oldMaxCash !== nextProps.maxCash) {
      if (nextProps.maxCash) {
        this.setState({
          fortune: Math.round(nextProps.propertyValue * 0.2),
          insuranceFortune: 0,
        });
      } else {
        this.setState({
          fortune: Math.round(nextProps.propertyValue * 0.1),
          insuranceFortune: Math.round(nextProps.propertyValue * 0.1),
        });
      }
    }
  }

  changeFortune(value, isSlider) {
    const newFortune = (isSlider ? Math.round(value * this.props.propertyValue) : value);

    if (isSlider && newFortune < 0.1 * this.props.propertyValue) {
      // If it is a slider, and the newFortune is below 10%, do not even update
      return;
    }

    this.setState({
      fortune: newFortune,
    },
      function () {
        this.adjustValues(true, isSlider);
      }.bind(this)
    );
  }

  changeInsuranceFortune(value, isSlider) {
    this.setState({
      insuranceFortune: (isSlider ? Math.round(value * this.props.propertyValue) : value),
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
    } else if (this.props.maxDebt) {
      // If the user wants maximum Debt, always keep both combined at 20%
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
        <Line10aSliders
          fortune={this.state.fortune}
          insuranceFortune={this.state.insuranceFortune}
          maxDebt={this.props.maxDebt}
          propertyValue={this.props.propertyValue}
          changeFortune={
            (value, isSlider) => this.changeFortune(value, isSlider)
          }
          changeInsuranceFortune={
            (value, isSlider) => this.changeInsuranceFortune(value, isSlider)
          }
        />
        {this.props.step === 9 ?
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

Line10a.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  maxCash: PropTypes.bool.isRequired,
  maxDebt: PropTypes.bool.isRequired,
  propertyValue: PropTypes.number.isRequired,
  completeStep: PropTypes.func.isRequired,
};
