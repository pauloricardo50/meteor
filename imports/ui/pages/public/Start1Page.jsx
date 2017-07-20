import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import merge from 'lodash/merge';
import queryString from 'query-string';
import classnames from 'classnames';

import Button from '/imports/ui/components/general/Button.jsx';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import { T } from '/imports/ui/components/general/Translation.jsx';
import { toNumber } from '/imports/js/helpers/conversionFunctions';
import {
  changeProperty,
  changeFortune,
  changeIncome,
  getBorrowRatio,
  getIncomeRatio,
  getTheoreticalMonthly,
} from '/imports/js/helpers/startFunctions';
import { storageAvailable } from '/imports/js/helpers/browserFunctions';
import Accordion from '/imports/ui/components/general/Accordion.jsx';

import Start1Calculator from './startPage/Start1Calculator.jsx';

const getArray = (income, fortune, property, borrow, ratio) => {
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
    'fa-exclamation warning':
      !isFalse &&
      ((borrow <= 0.9 && borrow > 0.8 + 0.001) ||
        (ratio <= 0.38 && ratio > 1 / 3 + 0.001)),
    'fa-times error': isFalse,
  });
  return [
    {
      label: 'Start1Page.incomeLabel',
      labelIcon: incomeIcon,
      name: 'income',
      sliderIncrement: 500000,
    },
    {
      label: 'Start1Page.fortuneLabel',
      labelIcon: fortuneIcon,
      name: 'fortune',
      sliderIncrement: 500000,
    },
    {
      label: 'Start1Page.propertyLabel',
      labelIcon: propertyIcon,
      name: 'property',
      sliderIncrement: 2000000,
    },
  ];
};

export default class Start1Page extends Component {
  constructor(props) {
    super(props);

    // Load previously stored localStorage if it exists
    if (storageAvailable('localStorage') && localStorage.ePotekSliders) {
      this.state = {
        ...JSON.parse(localStorage.ePotekSliders),
        isFirstVisit: false,
        showDescription: false,
      };
    } else {
      this.state = {
        income: {
          value: 500000,
          minValue: 0,
          auto: true,
        },
        fortune: {
          value: 500000,
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
        isFirstVisit: true,
        showDescription: true,
      };
    }

    this.type = props.match.params.type || 'test';
  }

  componentDidMount() {
    if (localStorage && !localStorage.ePotekSliders) {
      // If there isn't a previously stored value
      // UX: make user understand he can use the slider, by quickly pulling it down
      Meteor.setTimeout(
        () =>
          this.setState(prevState => ({
            income: { ...prevState.income, value: 0 },
            fortune: { ...prevState.fortune, value: 0 },
            property: { ...prevState.property, value: 0 },
          })),
        250,
      );
    }
  }

  componentWillUnmount() {
    if (storageAvailable('localStorage')) {
      localStorage.ePotekSliders = JSON.stringify(this.state);
    }
  }

  getUrl = () => {
    const queryparams = {
      property:
        this.type !== 'test' ? Math.round(this.state.property.value) : 0,
      income: Math.round(this.state.income.value),
      fortune: Math.round(this.state.fortune.value),
    };

    return `/start2/${this.type}?${queryString.stringify(queryparams)}`;
  };

  setSliderMax = (name, value) => {
    const object = {};
    object[name] = value;
    this.setState(object);
  };

  setStateValue = (name, value, autoOff = false) => {
    const object = {};
    object[name] = {};
    object[name].value = Math.min(Math.round(toNumber(value)), 1000000000); // Max $1B
    object[name].auto = false;

    if (this.timeout) {
      Meteor.clearTimeout(this.timeout);
    }

    // Set the state of the value that is changed, and immediately recommend other minValues
    this.setState(
      prev => merge({}, prev, object),
      () => this.recommendValues(name, autoOff),
    );
  };

  handleReset = () => {
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
  };

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
            Meteor.setTimeout(() => {
              const resetO = {};
              resetO[key] = {};
              resetO[key].value = this.state[name].minValue;
              this.setState(prev => merge({}, prev, resetO));
            }, 400);
          }
        }
      }
    }

    if (autoOff) {
      o[name].auto = false;
      o[name].minValue = 0;
    }

    this.setState(prev => merge({}, prev, o));
  }

  render() {
    const property = this.state.property.value;
    const income = this.state.income.value;
    const fortune = this.state.fortune.value;
    const borrowRatio = getBorrowRatio(property, fortune);
    const monthly = getTheoreticalMonthly(
      fortune - property * 0.05,
      property,
      borrowRatio,
    );
    const incomeRatio = getIncomeRatio(monthly, income);
    const childProps = { income, fortune, property, borrowRatio, incomeRatio };

    return (
      <section className="oscar">
        <article className="mask1 small-oscar">
          <h1>
            <T id="Start1Page.title" />
          </h1>
          <hr />

          <Button
            icon={
              this.state.showDescription || this.state.isFirstVisit
                ? <ArrowUp />
                : <ArrowDown />
            }
            onTouchTap={() =>
              this.setState(prev => ({
                showDescription: !prev.showDescription,
              }))}
            style={
              this.state.showDescription
                ? { minWidth: 'unset', width: 36 }
                : { marginBottom: 16, minWidth: 'unset', width: 36 }
            }
          />
          <Accordion
            isActive={this.state.showDescription}
            style={this.state.showDescription ? { margin: '40px 0' } : {}}
          >
            <div className="description" style={{ margin: 0 }}>
              <p>
                <T id="Start1Page.description1" />
                <br />
                <br />
                <T id="Start1Page.description2" />
              </p>
            </div>
          </Accordion>

          {!this.state.isFirstVisit
            ? <Start1Calculator
              {...childProps}
              inputArray={getArray(
                  income,
                  fortune,
                  property,
                  borrowRatio,
                  incomeRatio,
                  this.state.property.auto,
                )}
              setStateValue={this.setStateValue}
              setSliderMax={this.setSliderMax}
              parentState={this.state}
              handleReset={this.handleReset}
              getUrl={this.getUrl}
            />
            : <div className="text-center" style={{ marginBottom: 40 }}>
              <Button
                raised
                primary
                label={<T id="Start1Page.showCalculatorButton" />}
                onTouchTap={() =>
                    this.setState({
                      isFirstVisit: false,
                      showDescription: false,
                    })}
                style={{ height: 'unset' }}
                overlayStyle={{ padding: 20 }}
              />
            </div>}
        </article>
      </section>
    );
  }
}

Start1Page.propTypes = {};
