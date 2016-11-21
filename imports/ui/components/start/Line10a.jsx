import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';


import Line10aSliders from './Line10aSliders.jsx';

var timer;

export default class Line10a extends Component {
  componentDidMount() {
    // Set the initial fortune values based on the choice in line 8, sum of both has to be 20%
    if (this.props.maxCash) {
      this.props.setStateValue('fortune', String(Math.round(this.props.propertyValue * 0.2)));
      this.props.setStateValue('insuranceFortune', '0');
    } else {
      this.props.setStateValue('fortune', String(Math.round(this.props.propertyValue * 0.1)));
      this.props.setStateValue('insuranceFortune', String(Math.round(this.props.propertyValue * 0.1)));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.maxCash !== n.maxCash ||
      p.maxDebt !== n.maxDebt ||
      p.propertyValue !== n.propertyValue ||
      p.fortune !== n.fortune ||
      p.insuranceFortune !== n.insuranceFortune
    );
  }

  componentWillReceiveProps(nextProps) {
    const oldMaxCash = this.props.maxCash;

    if (oldMaxCash !== nextProps.maxCash) {
      if (nextProps.maxCash) {
        this.props.setStateValue('fortune', String(Math.round(nextProps.propertyValue * 0.2)));
        this.props.setStateValue('insuranceFortune', '0');
      } else {
        this.props.setStateValue('fortune', String(Math.round(nextProps.propertyValue * 0.1)));
        this.props.setStateValue('insuranceFortune', String(Math.round(nextProps.propertyValue * 0.1)));
      }
    }
  }

  changeFortune(value, isSlider) {
    const newFortune = (isSlider ? Math.round(value * this.props.propertyValue) : value);

    if (isSlider && newFortune < 0.1 * this.props.propertyValue) {
      // If it is a slider, and the newFortune is below 10%, do not even update
      return;
    }

    this.props.setStateValue(
      'fortune',
      String(newFortune),
      () => this.adjustValues(true, isSlider)
    );
  }

  changeInsuranceFortune(value, isSlider) {
    this.props.setStateValue(
      'insuranceFortune',
      String(isSlider ? Math.round(value * this.props.propertyValue) : value),
      () => this.adjustValues(false, isSlider)
    );
  }

  adjustValues(isFortune, isSlider) {
    if (isSlider) {
      this.adjustValuesFunc(isFortune);
    } else {
      Meteor.clearTimeout(timer);

      // If this isn't a slider, wait for 500ms before auto adjusting the other value
      timer = Meteor.setTimeout(() => {
        this.adjustValuesFunc(isFortune);
      }, 500);
    }
  }

  adjustValuesFunc(isFortune) {
    const f = this.props.fortune;
    const i = this.props.insuranceFortune;
    const p = this.props.propertyValue;

    // Make sure fortune is always at least 10%, and set insurance to 10% as well
    if (f < 0.1 * p) {
      this.props.setStateValue('fortune', String(Math.round(0.1 * p)));
      this.props.setStateValue('insuranceFortune', String(Math.round(0.1 * p)));

    } else if (f + i < 0.2 * p) {
      // If both fortunes combined aren't at least 20% of the propertyValue
      // Set the other value to be the rest
      if (isFortune) {
        this.props.setStateValue('insuranceFortune', String(Math.round((0.2 * p) - f)));
      } else {
        this.props.setStateValue('fortune', String(Math.round((0.2 * p) - i)));
      }
    } else if (this.props.maxDebt) {
      // If the user wants maximum Debt, always keep both combined at 20%
      if (isFortune) {
        this.props.setStateValue('insuranceFortune', String(Math.round((0.2 * p) - f)));
      } else {
        this.props.setStateValue('fortune', String(Math.round((0.2 * p) - i)));
      }
    }
  }

  render() {
    return (
      <article onClick={this.props.setStep} className={this.props.classes.text}>
        <Line10aSliders
          twoBuyers={this.props.twoBuyers}
          fortune={this.props.fortune}
          insuranceFortune={this.props.insuranceFortune}
          maxDebt={this.props.maxDebt}
          propertyValue={this.props.propertyValue}
          changeFortune={
            (value, isSlider) => this.changeFortune(value, isSlider)
          }
          changeInsuranceFortune={
            (value, isSlider) => this.changeInsuranceFortune(value, isSlider)
          }
        />
        {this.props.step === 9 &&
          <div className="text-center col-xs-12">
            <RaisedButton
              label="Je suis satisfait"
              onClick={e => this.props.completeStep(e, true)}
              primary
            />
          </div>
        }
      </article>
    );
  }
}

Line10a.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  twoBuyers: PropTypes.bool.isRequired,
  maxCash: PropTypes.bool.isRequired,
  maxDebt: PropTypes.bool.isRequired,
  propertyValue: PropTypes.string.isRequired,
  fortune: PropTypes.string.isRequired,
  insuranceFortune: PropTypes.string.isRequired,
};
