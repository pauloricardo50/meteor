import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';


import { toNumber } from '/imports/js/conversionFunctions';
import { changeProperty, changeFortune, changeIncome } from '/imports/js/start-functions';
import constants from '/imports/js/constants';
import StartLine from '/imports/ui/components/start/StartLine.jsx';
import StartRecap from '/imports/ui/components/start/StartRecap.jsx';


const array = [
  {
    label: 'Revenus annuels bruts',
    name: 'income',
    sliderIncrement: 500000,
  },
  {
    label: 'Fonds propres',
    name: 'fortune',
    sliderIncrement: 1000000,
  },
  {
    label: 'Prix d\'achat',
    name: 'property',
    sliderIncrement: 2000000,
  },
];

export default class Start1Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      property: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      fortune: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      income: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      propertySlider: 2000000,
      fortuneSlider: 1000000,
      incomeSlider: 500000,
    };

    this.type = FlowRouter.getQueryParam('type');

    this.setStateValue = this.setStateValue.bind(this);
    this.setSliderMax = this.setSliderMax.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  componentDidMount() {
    Meteor.setTimeout(() => this.setState({
      income: {
        value: 350000,
        minValue: 0,
        auto: true,
      },
    }), 250);
    Meteor.setTimeout(() => this.setState({
      income: {
        value: 0,
        minValue: 0,
        auto: true,
      },
    }), 500);
  }

  setSliderMax(name, value) {
    const object = {};
    object[name] = value;
    this.setState(object);
  }

  setStateValue(name, value, autoOff = false) {
    const object = {};
    object[name] = {};
    object[name].value = Math.min(Math.round(toNumber(value)), 1000000000); // Max $1B
    object[name].auto = false;

    if (this.timeout) {
      Meteor.clearTimeout(this.timeout);
    }

    // Set the state of the value that is changed, and immediately recommend other minValues
    this.setState(prev => _.merge({}, prev, object), () => this.recommendValues(name, autoOff));
  }

  recommendValues(name, autoOff) {
    const value = this.state[name].value;
    let o = {
      property: {},
      fortune: {},
      income: {},
    };

    o = (() => {
      switch (name) {
        case 'property': return changeProperty(this.state, o, value);
        case 'fortune': return changeFortune(this.state, o, value);
        case 'income': return changeIncome(this.state, o, value);
        default: return o;
      }
    })();

    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        // If the minValue was modified, and the property is still on auto mode, also set the value
        if ((o[key].minValue !== undefined && o[key].minValue !== null) && this.state[key].auto) {
          o[key].value = o[key].minValue;
        }

        // Set a value back to auto when a user drags it to 0
        if (key === name && value === 0) {
          o[key].auto = true;

          // If the user sets a slider back to 0, and it had a minValue set to it, move it to the
          // minimum value with a little delay
          if (this.state[name].minValue) {
            Meteor.setTimeout(() => {
              const resetO = {};
              resetO[key] = {};
              resetO[key].value = this.state[name].minValue;
              this.setState(prev => _.merge({}, prev, resetO));
            }, 400);
          }
        }
      }
    }

    if (autoOff) {
      o[name].auto = false;
      o[name].minValue = 0;
    }

    this.setState(prev => _.merge({}, prev, o));
  }

  isValid() {
    const s = this.state;
    const minIncome = s.property.value * constants.propertyToIncome();
    const borrow = Math.max((s.property.value - s.fortune.value) / s.property.value, 0);
    const ratio = minIncome / s.income.value / 3;

    return (
      borrow <= 0.8 &&
      ratio <= 1 / 3
    );
  }

  getUrl() {
    const pathDef = '/start2';
    const params = {};
    const queryParams = {
      type: this.type || 'test',
      property: Math.round(this.state.property.value),
    };

    return FlowRouter.path(pathDef, params, queryParams);
  }


  render() {
    return (
      <section className="oscar">
        <article className="small-oscar mask1">
          <h1>
            {this.type === 'acquisition'
              ? 'Commencez une acquisition'
              : 'Identifiez votre capacité d\'emprunt'
            }
          </h1>
          <hr />

          <div className="content">
            <div className="sliders">
              {array.map(line =>
                <StartLine
                  key={line.name}
                  {...this.state[line.name]}
                  {...line}
                  sliderMax={this.state[`${line.name}Slider`]}
                  setStateValue={this.setStateValue}
                  setSliderMax={() => this.setSliderMax(
                    `${line.name}Slider`, this.state[`${line.name}Slider`] + line.sliderIncrement,
                  )}
                />,
              )}
            </div>
            <div className="separator" />
            <StartRecap
              income={this.state.income.value}
              fortune={this.state.fortune.value}
              property={this.state.property.value}
            />
          </div>

          <div className="button">
            <RaisedButton
              label="Passer au check-up complet"
              disabled={
                !this.state.property.value ||
                !this.state.income.value ||
                !this.state.fortune.value
              }
              primary={this.isValid()}
              href={this.getUrl()}
            />
          </div>
        </article>
      </section>
    );
  }
}

Start1Page.propTypes = {
};
