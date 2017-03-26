import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import classnames from 'classnames';

import RaisedButton from 'material-ui/RaisedButton';

import { toNumber, toMoney } from '/imports/js/helpers/conversionFunctions';
import {
  changeProperty,
  changeFortune,
  changeIncome,
} from '/imports/js/helpers/startFunctions';
import constants from '/imports/js/config/constants';
import StartLine from './startPage/StartLine.jsx';
import StartRecap from './startPage/StartRecap.jsx';
import ExpensesChart from '/imports/ui/components/charts/ExpensesChart.jsx';
import Accordion from '/imports/ui/components/general/Accordion.jsx';

const getArray = (income, fortune, property, borrow, ratio, propertyAuto) => {
  const isReady = !!(income && fortune && property);
  const incomeIcon = classnames({
    fa: true,
    'fa-check success': ratio <= 1 / 3 + 0.001,
    'fa-exclamation warning': ratio <= 0.38 && ratio > 1 / 3 + 0.001,
    'fa-times error': ratio > 0.38,
  });
  const fortuneIcon = classnames({
    fa: true,
    'fa-check success': borrow <= 0.8 + 0.001,
    'fa-exclamation warning': borrow <= 0.9 && borrow > 0.8 + 0.001,
    'fa-times error': borrow > 0.9,
  });
  const isFalse = borrow > 0.9 || ratio > 0.38;
  const propertyIcon = classnames({
    fa: true,
    'fa-check success': borrow <= 0.8 + 0.001 && ratio <= 1 / 3 + 0.001,
    'fa-exclamation warning': !isFalse &&
      ((borrow <= 0.9 && borrow > 0.8 + 0.001) ||
        (ratio <= 0.38 && ratio > 1 / 3 + 0.001)),
    'fa-times error': isFalse,
  });
  return [
    {
      label: (
        <span>
          Revenus annuels bruts
          {' '}
          {isReady && <span className={incomeIcon} />}
        </span>
      ),
      name: 'income',
      sliderIncrement: 500000,
    },
    {
      label: (
        <span>
          Fonds Propres
          {' '}
          {isReady && <span className={fortuneIcon} />}
        </span>
      ),
      name: 'fortune',
      sliderIncrement: 500000,
    },
    {
      label: (
        <span>
          {propertyAuto ? "Prix d'Achat Maximal" : "Prix d'Achat"}
          {' '}
          {isReady && <span className={propertyIcon} />}
        </span>
      ),
      name: 'property',
      sliderIncrement: 2000000,
    },
  ];
};

export default class Start1Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      income: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      fortune: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      property: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      incomeSlider: 500000,
      fortuneSlider: 500000,
      propertySlider: 2000000,
    };

    this.type = props.match.params.type || 'test';

    this.setStateValue = this.setStateValue.bind(this);
    this.setSliderMax = this.setSliderMax.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    // UX: make user understand he can use the slider, by quickly pushing it up and down
    Meteor.setTimeout(
      () => this.setState({
        income: {
          value: 350000,
          minValue: 0,
          auto: true,
        },
      }),
      250,
    );
    Meteor.setTimeout(
      () => this.setState({
        income: {
          value: 0,
          minValue: 0,
          auto: true,
        },
      }),
      500,
    );
  }

  handleReset() {
    this.setState({
      income: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      fortune: {
        value: 0,
        minValue: 0,
        auto: true,
      },
      property: {
        value: 0,
        minValue: 0,
        auto: true,
      },
    });
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
    this.setState(
      prev => _.merge({}, prev, object),
      () => this.recommendValues(name, autoOff),
    );
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
        case 'property':
          return changeProperty(this.state, o, value);
        case 'fortune':
          return changeFortune(this.state, o, value);
        case 'income':
          return changeIncome(this.state, o, value);
        default:
          return o;
      }
    })();

    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        // If the minValue was modified, and the property is still on auto mode, also set the value
        if (
          o[key].minValue !== undefined &&
          o[key].minValue !== null &&
          this.state[key].auto
        ) {
          o[key].value = o[key].minValue;
        }

        // Set a value back to auto when a user drags it to 0
        if (key === name && value === 0) {
          o[key].auto = true;

          // If the user sets a slider back to 0, and it had a minValue set to it, move it to the
          // minimum value with a little delay
          if (this.state[name].minValue) {
            Meteor.setTimeout(
              () => {
                const resetO = {};
                resetO[key] = {};
                resetO[key].value = this.state[name].minValue;
                this.setState(prev => _.merge({}, prev, resetO));
              },
              400,
            );
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
    // Make sure notary fees are paid
    const borrow = Math.max(
      (s.property.value * 1.05 - s.fortune.value) / s.property.value,
      0,
    );
    const ratio = minIncome / s.income.value / 3;

    return borrow <= 0.8 + 0.001 && ratio <= 1 / 3 + 0.001;
  }

  getUrl() {
    const queryparams = {
      property: this.type !== 'test'
        ? Math.round(this.state.property.value)
        : 0,
    };

    return `/start2/${this.type}?${queryString.stringify(queryparams)}`;
  }

  getMonthly(income, fortune, property) {
    return Math.max(
      (property * constants.maintenance +
        (property - fortune) * constants.loanCost()) /
        12,
      0,
    );
  }

  render() {
    const property = this.state.property.value;
    const income = this.state.income.value;
    const fortune = this.state.fortune.value;
    const loan = property * 1.05 - fortune;
    const borrow = Math.max((property * 1.05 - fortune) / property, 0);
    const ratio = this.getMonthly(income, fortune - property * 0.05, property) /
      (income / 12);

    return (
      <section className="oscar">
        <article className="small-oscar mask1">
          <h1>
            {this.type === 'acquisition'
              ? 'Commencez une acquisition'
              : "Identifiez votre capacité d'emprunt"}
          </h1>
          <hr />

          <div className="content">
            <div className="sliders">
              {getArray(
                income,
                fortune,
                property,
                borrow,
                ratio,
                this.state.property.auto,
              ).map(line => (
                <StartLine
                  key={line.name}
                  {...this.state[line.name]}
                  {...line}
                  sliderMax={this.state[`${line.name}Slider`]}
                  setStateValue={this.setStateValue}
                  setSliderMax={() =>
                    this.setSliderMax(
                      `${line.name}Slider`,
                      this.state[`${line.name}Slider`] + line.sliderIncrement,
                    )}
                />
              ))}
              <RaisedButton
                label="Recommencer"
                onTouchTap={this.handleReset}
                className="reset-button"
              />
            </div>
            <div className="separator" />
            <div className="recap">
              <StartRecap
                income={income}
                fortune={fortune}
                property={property}
                ratio={ratio}
                borrow={borrow}
              />
            </div>
          </div>

          <div className="chart text-center">
            <Accordion
              isActive={property && fortune && income && fortune < property}
            >
              <h3>
                Votre emprunt:
                {' '}
                <span className="active">
                  CHF {toMoney(Math.round(loan / 1000) * 1000)}
                </span>
              </h3>
              <ExpensesChart
                interests={loan * constants.interestsReal / 12 || undefined}
                amortizing={loan * constants.amortizing / 12 || 0}
                maintenance={property * constants.maintenanceReal / 12 || 0}
              />
            </Accordion>
          </div>

          <div className="button">
            <RaisedButton
              label="Passer au check-up complet"
              disabled={!property || !income || !fortune}
              primary={this.isValid()}
              containerElement={<Link to={this.getUrl()} />}
              id="ok"
            />
          </div>
        </article>
      </section>
    );
  }
}

Start1Page.propTypes = {};
