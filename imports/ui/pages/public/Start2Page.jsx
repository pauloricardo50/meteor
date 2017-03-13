import React, { Component, PropTypes } from 'react';
import Scroll from 'react-scroll';
import { FlowRouter } from 'meteor/kadira:flow-router';


import AutoStart from '/imports/ui/components/start/AutoStart.jsx';
import Start2Recap from '/imports/ui/components/start/Start2Recap.jsx';
import StartResult from '/imports/ui/components/start//StartResult.jsx';


import getFormArray from '/imports/js/StartFormArray';
import constants from '/imports/js/constants';


export default class Start2Page extends Component {
  constructor(props) {
    super(props);

    this.type = FlowRouter.getQueryParam('type');

    this.state = {
      purchaseType: 'acquisition',
      knowsProperty: this.type === 'acquisition',
      propertyValue: Number(FlowRouter.getQueryParam('property')) || undefined,
    };


    this.setFormState = this.setFormState.bind(this);
    this.setActiveLine = this.setActiveLine.bind(this);
  }

  setFormState(id, value, callback) {
    const object = {};
    object[id] = value;

    this.setState(object, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  setActiveLine(id) {
    this.setState({ activeLine: id });
  }

  isFinished() {
    return this.state.finalized;
  }

  getBonusIncome(arr) {
    // Sum all values, remove the lowest one, and return 50% of their average
    const sum = arr.reduce((tot, val) => tot + val, 0);
    const bestSum = sum - Math.min(...arr);
    return 0.5 * (bestSum / 3);
  }

  getIncome() {
    const s = this.state;
    const bonus1 = this.getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]);
    const bonus2 = this.getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]);
    return [
      s.propertyRent * 12,
      s.income1, s.income2,
      bonus1, bonus2,
      ...(s.otherIncomeArray ? s.otherIncomeArray.map(i => i.value * 12) : []),
    ].reduce((tot, val) => ((val > 0) && tot + val) || tot, 0);
  }


  getFortune() {
    const s = this.state;

    return [
      s.fortune1, s.fortune2,
    ].reduce((tot, val) => ((val > 0) && tot + val) || tot, 0);
  }

  getInsuranceFortune() {
    const s = this.state;

    return [
      s.insurance11, s.insurance12,
      s.insurance21, s.insurance22,
    ].reduce((tot, val) => ((val > 0) && tot + val) || tot, 0);
  }

  getExpenses() {
    const s = this.state;

    // Expenses is entered in monthly costs, multiply by 12
    return [
      ...(s.expensesArray ? s.expensesArray.map(i => i.value * 12) : []),
    ].reduce((tot, val) => ((val > 0) && tot + val) || tot, 0);
  }

  getMonthly() {
    const s = this.state;
    const propAndWork = s.propertyValue + (s.propertyWorkExists ? s.propertyWork : 0);

    return Math.max(
      ((propAndWork * constants.maintenance) +
      ((propAndWork - (s.fortuneUsed || 0)) * constants.loanCost())) / 12,

      ((propAndWork * constants.maintenance) +
        ((propAndWork * 0.8) * constants.loanCost())) / 12,

      0,
    );
  }

  getMonthlyReal() {
    const s = this.state;
    const propAndWork = s.propertyValue + (s.propertyWorkExists ? s.propertyWork : 0);
    return Math.max(
      ((propAndWork * constants.maintenanceReal) +
      ((propAndWork - (s.fortuneUsed || 0)) * constants.loanCostReal())) / 12,
      0,
    );
  }


  render() {
    const props = {
      income: this.getIncome() || 0,
      fortune: this.getFortune() || 0,
      property: this.state.propertyValue || 0,
      insuranceFortune: this.getInsuranceFortune() || 0,
      expenses: this.getExpenses() || 0,
      propertyWork: this.state.propertyWork || 0,
      fortuneUsed: this.state.fortuneUsed || 0,
      minFortune: (0.05 * this.state.propertyValue) + (0.2 * (this.state.propertyValue + (this.state.propertyWork || 0))) || 0,
      fees: this.state.propertyValue * 0.05 || 0,
      propAndWork: this.state.propertyValue + (this.state.propertyWork || 0),
      monthly: this.getMonthly() || 0,
      monthlyReal: this.getMonthlyReal() || 0,
    };


    return (
      <section className="start2">
        <div className="form">
          <AutoStart
            formState={this.state}
            formArray={getFormArray(this.state, props)}
            setFormState={this.setFormState}
            setActiveLine={this.setActiveLine}
          />
        </div>
        {!this.isFinished() &&
          <div className="start2recap mask1">
            <div className="fixed-wrapper">
              <Start2Recap
                {...props}
              />
            </div>
          </div>
        }
        {this.isFinished() &&
          <StartResult
            {...props}
          />
        }
      </section>
    );
  }
}

Start2Page.propTypes = {
};
