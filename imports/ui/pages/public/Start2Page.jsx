import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import classNames from 'classnames';
import queryString from 'query-string';

import RaisedButton from 'material-ui/RaisedButton';

import getFormArray from '/imports/js/arrays/StartFormArray';
import constants from '/imports/js/config/constants';
import {
  isFinished,
  getBonusIncome,
  getIncome,
  getOtherIncome,
  getFortune,
  getBankFortune,
  getInsuranceFortune,
  getRealEstateFortune,
  getRealEstateValue,
  getRealEstateDebt,
  getExpenses,
  getMonthly,
  getMonthlyReal,
  calculateProperty,
  getLenderCount,
  getRatio,
  getBorrow,
} from '/imports/js/helpers/startFunctions';

import AutoStart from './startPage/AutoStart.jsx';
import Start2Recap from './startPage/Start2Recap.jsx';
import StartResult from './startPage/StartResult.jsx';
import StartSignUp from './startPage/StartSignUp.jsx';

export default class Start2Page extends Component {
  constructor(props) {
    super(props);

    const type = props.match.params.type || 'test';

    this.state = {
      showUX: true,
      type,
      purchaseType: 'acquisition',
      knowsProperty: type === 'acquisition',
      propertyValue: Number(
        queryString.parse(props.location.search).property,
      ) || undefined,
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
    if (this.state.activeLine !== id) {
      this.setState({ activeLine: id });
    }
  }

  render() {
    if (this.state.showUX) {
      return (
        <div className="ux-text animated fadeIn text-center">
          <h1>
            Prenez 2 minutes pour nous en dire un peu plus sur vous
          </h1>
          <div>
            <RaisedButton
              label="Avec Plaisir"
              primary
              onClick={() =>
                Meteor.setTimeout(() => this.setState({ showUX: false }), 400)}
            />
          </div>
        </div>
      );
    }

    const s = this.state;
    const property = s.propertyValue || calculateProperty(s) || 0;
    const fees = 0.05 * property;
    const lppFees = s.insuranceFortuneUsed * constants.lppFees || 0;
    const props = {
      formState: s,
      type: this.state.type,
      salary: (s.income1 || 0) + (s.income2 || 0),
      bonus: getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]) +
        getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]) || 0,
      income: getIncome(s) || 0,
      otherIncome: getOtherIncome(s) || 0,
      fortune: getFortune(s) || 0,
      property,
      insuranceFortune: getInsuranceFortune(s) || 0,
      expenses: getExpenses(s) || 0,
      propertyWork: s.propertyWork || 0,
      fortuneUsed: s.fortuneUsed || 0,
      insuranceFortuneUsed: s.insuranceFortuneUsed || 0,
      minFortune: fees +
        lppFees +
        (1 - constants.maxLoan(this.state.usageType)) *
          (property + (s.propertyWork || 0)) || 0,
      minCash: fees + lppFees + 0.1 * (property + (s.propertyWork || 0)) || 0,
      fees: fees || 0,
      lppFees: s.insuranceFortuneUsed * constants.lppFees || 0,
      propAndWork: property + (s.propertyWork || 0),
      monthly: getMonthly(s) || 0,
      monthlyReal: getMonthlyReal(s) || 0,
      project: fees + property + (s.propertyWork || 0) + lppFees || 0,
      realEstate: getRealEstateFortune(s) || 0,
      realEstateValue: getRealEstateValue(s) || 0,
      realEstateDebt: getRealEstateDebt(s) || 0,
      bankFortune: getBankFortune(s) || 0,
      usageType: this.state.usageType,
    };

    const finished = isFinished(s, props.minFortune);

    props.ratio = getRatio(props.income, props.expenses, props.monthly);
    props.borrow = getBorrow(
      props.fortuneUsed + props.insuranceFortuneUsed,
      props.propAndWork,
      props.property,
      props.fees + props.lppFees,
    );
    props.lenderCount = getLenderCount(props.borrow, props.ratio);

    return (
      <section className="start2 animated fadeIn">
        <div className={classNames({ form: true, isFinished: finished })}>
          <AutoStart
            formState={{
              ...s,
              minFortune: props.minFortune,
              minCash: props.minCash,
              fortune: props.fortune,
            }}
            formArray={getFormArray(s, props)}
            setFormState={this.setFormState}
            setActiveLine={this.setActiveLine}
          />
        </div>
        {!finished &&
          <div className="start2recap mask1">
            <h3 className="recap-title bold">
              Plan financier
            </h3>
            <div className="shadow-top" />
            <div className="shadow-bottom" />
            <Start2Recap {...props} />
          </div>}
        {finished &&
          <Scroll.Element name={'final'}>
            <StartResult
              history={this.props.history}
              currentUser={this.props.currentUser}
              {...props}
              setFormState={this.setFormState}
            />
          </Scroll.Element>}

        {this.state.done &&
          <Scroll.Element name={'done'} style={{ width: '100%' }}>
            <StartSignUp formState={s} history={this.props.history} />
          </Scroll.Element>}
      </section>
    );
  }
}

Start2Page.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};

Start2Page.defaultProps = {
  currentUser: undefined,
};
