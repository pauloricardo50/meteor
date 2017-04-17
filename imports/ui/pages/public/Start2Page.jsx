import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import classNames from 'classnames';
import PropTypes from 'prop-types';
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

import Recap from '/imports/ui/components/general/Recap.jsx';
import AutoStart from './startPage/AutoStart.jsx';
import StartResult from './startPage/StartResult.jsx';
import StartSignUp from './startPage/StartSignUp.jsx';

export default class Start2Page extends Component {
  constructor(props) {
    super(props);

    const type = props.match.params.type || 'test';
    const params = queryString.parse(props.location.search);

    this.state = {
      showUX: true,
      type,
      purchaseType: 'acquisition',
      knowsProperty: type === 'acquisition',
      propertyValue: Number(params.property) || undefined,
      initialIncome: Number(params.income) || undefined,
      initialFortune: Number(params.fortune) || undefined,
    };

    this.setFormState = this.setFormState.bind(this);
    this.setActiveLine = this.setActiveLine.bind(this);
  }

  setFormState(id, value, callback, obj) {
    // If a whole object is given, set that object to state
    if (obj) {
      this.setState(obj, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    } else {
      // Else, simple set one value to state
      const object = {};
      object[id] = value;

      this.setState(object, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    }
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
    const property = s.propertyValue || 0;
    const fees = property * constants.notaryFees;
    const lppFees = s.insuranceFortuneUsed * constants.lppFees || 0;
    const props = {
      formState: s,
      type: s.type,
      usageType: s.usageType,
      property,
      propertyWork: s.propertyWork || 0,
      propAndWork: property + (s.propertyWork || 0),
      salary: (s.income1 || 0) + (s.income2 || 0),
      bonus: getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]) +
        getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]) || 0,
      income: getIncome(s) || 0,
      otherIncome: getOtherIncome(s.otherIncomeArray) || 0,
      fortune: getFortune(s) || 0,
      insuranceFortune: getInsuranceFortune(s) || 0,
      expenses: getExpenses(s.expensesArray) || 0,
      fortuneUsed: s.fortuneUsed || 0,
      insuranceFortuneUsed: s.insuranceFortuneUsed || 0,
      fees,
      lppFees,
      project: fees + property + (s.propertyWork || 0) + lppFees || 0,
      monthly: getMonthly(s) || 0,
      monthlyReal: getMonthlyReal(s) || 0,
      realEstate: getRealEstateFortune(s.realEstateArray) || 0,
      realEstateValue: getRealEstateValue(s.realEstateArray) || 0,
      realEstateDebt: getRealEstateDebt(s.realEstateArray) || 0,
      loanWanted: s.loanWanted,
    };
    props.minCash = fees +
      0.1 * props.propAndWork +
      0.1 * props.propAndWork * constants.lppFees;
    props.fortuneNeeded = props.project - s.loanWanted;
    props.totalFortune = props.fortune + props.insuranceFortune;
    props.ratio = getRatio(props.income, props.expenses, props.monthly);
    props.borrow = getBorrow(
      props.fortuneUsed + props.insuranceFortuneUsed,
      props.propAndWork,
      props.property,
      props.fees + props.lppFees,
    );
    props.lenderCount = getLenderCount(props.borrow, props.ratio);

    // if you want to have a minimum loan, you use all your fortune, hence, you'll have to pay maximum lppFees
    // Round up to make sure the project works
    props.minLoan = Math.ceil(
      props.propAndWork -
        (props.fortune + props.insuranceFortune * (1 - constants.lppFees)) +
        fees,
    );
    props.minFortune = fees +
      (1 - constants.maxLoan(s.usageType)) * props.propAndWork;

    // If there isn't enough cash, add to minfortune the lppFees that will have to be paid, as long as it is below requirement
    if (props.fortune < props.minFortune) {
      props.minFortune += Math.min(
        props.insuranceFortune * constants.lppFees,
        (props.minFortune - props.fortune) * constants.lppFees,
      );
    }

    if (!props.property) {
      props.property = calculateProperty(
        props.fortune,
        props.insuranceFortune,
        props.income,
        props.usageType,
      );
    }

    const finished = isFinished(s, props.minFortune);

    return (
      <section className="start2 animated fadeIn">
        <div className={classNames({ form: true, isFinished: finished })}>
          <AutoStart
            formState={s}
            formArray={getFormArray(s, props, this.setFormState)}
            setFormState={this.setFormState}
            setActiveLine={this.setActiveLine}
          />
        </div>
        {!finished &&
          <div className="start2recap mask1">
            <h3 className="recap-title bold">
              Votre Plan Financier
            </h3>
            <div className="shadow-top" />
            <div className="shadow-bottom" />
            <Recap {...props} arrayName="start2" noScale />
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
