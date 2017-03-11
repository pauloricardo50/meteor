import React, { Component, PropTypes } from 'react';
import Scroll from 'react-scroll';
import { FlowRouter } from 'meteor/kadira:flow-router';


import AutoStart from '/imports/ui/components/start/AutoStart.jsx';
import StartRecap from '/imports/ui/components/start/StartRecap.jsx';
import StartResult from '/imports/ui/components/start//StartResult.jsx';


import getFormArray from '/imports/js/StartFormArray';


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
    const bestBonuses = arr.filter(b => b !== Math.min(...arr));

    // If the array contains twice the same minimum value, return the sum of 4 values divided by 3
    if (arr.reduce((tot, val) => (val === Math.min(...arr) ? tot + 1 : tot), 0) > 1) {
      return 0.5 * arr.reduce((tot, val) => tot + (val / 3), 0);
    }

    // Return 50% of the average of the best bonuses
    return 0.5 * bestBonuses.reduce((tot, val) => tot + (val / 3), 0);
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
      s.insurance11, s.insurance12,
    ].reduce((tot, val) => ((val > 0) && tot + val) || tot, 0);
  }


  render() {
    return (
      <section className="start2">
        <div className="form">
          <AutoStart
            formState={this.state}
            formArray={getFormArray(this.state)}
            setFormState={this.setFormState}
            setActiveLine={this.setActiveLine}
          />
        </div>
        {(!this.isFinished() && this.getIncome() > 0 && this.getFortune() > 0 && this.state.propertyValue) > 0 &&
          <div className="start2recap mask1">
            <div className="fixed-wrapper">
              <StartRecap
                income={this.getIncome()}
                fortune={this.getFortune()}
                property={this.state.propertyValue}
                noPlaceholder
              />
            </div>
          </div>
        }
        {this.isFinished() &&
          <StartResult
            income={this.getIncome()}
            fortune={this.getFortune()}
            property={this.state.propertyValue}
          />
        }
      </section>
    );
  }
}

Start2Page.propTypes = {
};
