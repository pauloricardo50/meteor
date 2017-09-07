import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import Button from '/imports/ui/components/general/Button.jsx';

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
  getRetirement,
  getMaxLoan,
} from '/imports/js/helpers/startFunctions';

import { T } from '/imports/ui/components/general/Translation.jsx';
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
  }

  // componentDidMount() {
  //   this.setState({
  //     age: 23,
  //     bonusExists: false,
  //     borrowerCount: 1,
  //     expensesExist: false,
  //     finalized: true,
  //     fortune1: 250000,
  //     fortuneRequiredAgreed: true,
  //     fortuneUsed: 250000,
  //     income1: 200000,
  //     initialFortune: 250000,
  //     initialFortuneAgreed: true,
  //     initialIncome: 200000,
  //     initialIncomeAgreed: true,
  //     insurance1Exists: false,
  //     insurance11: 0,
  //     insurance2Exists: false,
  //     insuranceFortuneUsed: 0,
  //     knowsProperty: true,
  //     loanWanted: 800000,
  //     notaryFeesAgreed: true,
  //     otherIncome: false,
  //     propertyValue: 1000000,
  //     propertyWorkExists: false,
  //     purchaseType: 'acquisition',
  //     realEstateExists: false,
  //     showUX: false,
  //     type: 'acquisition',
  //     usageType: 'primary',
  //     useInsurance: false,
  //   });
  // }

  setActiveLine = (id, callback) => {
    if (this.state.activeLine !== id) {
      this.setState({ activeLine: id }, () => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    } else if (typeof callback === 'function') {
      callback();
    }
  };

  setFormState = (id, value, callback, obj) => {
    // Keep track of the last modified value, to prevent autofocus jumps
    this.setState({ lastModified: id });

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
  };

  render() {
    if (this.state.showUX) {
      return (
        <div className="ux-text animated fadeIn text-center">
          <div className="text">
            <h1>
              <T id="Start2Page.initialText1" />
            </h1>
            <h2>
              <small>
                <T id="Start2Page.initialText2" />
              </small>
            </h2>
          </div>
          <div>
            <Button
              raised
              label={<T id="Start2Page.initialButton" />}
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

    // Floor the fees to make them forgiving for the user
    const fees = Math.floor(property * constants.notaryFees);
    const lppFees = Math.floor(s.insuranceFortuneUsed * constants.lppFees || 0);
    const toRetirement = getRetirement(s);
    const childProps = {
      formState: s,
      type: s.type,
      usageType: s.usageType,
      property,
      propertyWork: s.propertyWork || 0,
      propAndWork: property + (s.propertyWork || 0),
      salary: (s.income1 || 0) + (s.income2 || 0),
      bonus:
        getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]) +
        getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]),
      income: getIncome(s) || 0,
      otherIncome: getOtherIncome(s.otherIncomeArray) || 0,
      fortune: getFortune(s) || 0,
      insuranceFortune:
        s.insuranceConditions !== false ? getInsuranceFortune(s) || 0 : 0,
      insuranceFortuneDisplayed: getInsuranceFortune(s) || 0,
      expenses: getExpenses(s.expensesArray) || 0,
      fortuneUsed: s.fortuneUsed || 0,
      insuranceFortuneUsed: s.insuranceFortuneUsed || 0,
      fees,
      lppFees,
      project: fees + property + (s.propertyWork || 0) + lppFees || 0,
      realEstate: getRealEstateFortune(s.realEstateArray) || 0,
      realEstateValue: getRealEstateValue(s.realEstateArray) || 0,
      realEstateDebt: getRealEstateDebt(s.realEstateArray) || 0,
      loanWanted: s.loanWanted,
      propertyRent: s.propertyRent,
      toRetirement,
    };
    childProps.minCash =
      fees +
      0.1 * childProps.propAndWork +
      0.1 * childProps.propAndWork * constants.lppFees;
    childProps.fortuneNeeded = childProps.project - s.loanWanted;
    childProps.totalFortune = childProps.fortune + childProps.insuranceFortune;
    childProps.borrow = getBorrow(
      childProps.fortuneUsed + childProps.insuranceFortuneUsed,
      childProps.propAndWork,
      childProps.fees + childProps.lppFees,
    );
    childProps.monthly = getMonthly(s, childProps.borrow, toRetirement) || 0;
    childProps.monthlyReal =
      getMonthlyReal(s, childProps.borrow, toRetirement) || 0;
    childProps.ratio = getRatio(
      childProps.income,
      childProps.expenses,
      childProps.monthly,
    );
    childProps.lenderCount = getLenderCount(
      childProps.borrow,
      childProps.ratio,
    );

    // if you want to have a minimum loan, you use all your fortune, hence, you'll have to pay maximum lppFees
    // Round up to make sure the project works
    childProps.minLoan = Math.round(
      childProps.propAndWork -
        (childProps.fortune +
          childProps.insuranceFortune * (1 - constants.lppFees)) +
        fees,
    );
    // If the income is too low to afford a loan higher than some amount
    childProps.maxLoan = getMaxLoan(
      s,
      childProps.income,
      childProps.fortune,
      childProps.insuranceFortune,
      toRetirement,
      childProps.propAndWork,
    );
    childProps.minFortune =
      fees +
      (1 - constants.maxLoan(s.usageType, childProps.toRetirement)) *
        childProps.propAndWork;

    // If there isn't enough cash, add to minfortune the lppFees that will have to be paid, as long as it is below requirement
    if (childProps.fortune < childProps.minFortune) {
      childProps.minFortune += Math.min(
        childProps.insuranceFortune * constants.lppFees,
        (childProps.minFortune - childProps.fortune) * constants.lppFees,
      );
    }

    if (!childProps.property) {
      childProps.property = calculateProperty(
        childProps.fortune,
        childProps.insuranceFortune,
        childProps.income,
        childProps.usageType,
        childProps.toRetirement,
      );
    }

    const finished = isFinished(s, childProps.minFortune);

    return (
      <div style={{ height: 'inherit', width: 'inherit' }}>
        <section className="start2 animated fadeIn">
          <div className={classNames({ form: true, isFinished: finished })}>
            <AutoStart
              formState={s}
              formArray={getFormArray(s, childProps, this.setFormState)}
              setFormState={this.setFormState}
              setActiveLine={this.setActiveLine}
            />
          </div>
          {!finished &&
            <div className="start2recap mask1 animated fadeInUp">
              <h3 className="recap-title bold">
                <T id="Start2Page.recapTitle" />
              </h3>
              <div className="shadow-top" />
              <div className="shadow-bottom" />
              <Recap {...childProps} arrayName="start2" noScale />
            </div>}
          {finished &&
            <Scroll.Element name={'final'}>
              <StartResult
                history={this.props.history}
                currentUser={this.props.currentUser}
                {...childProps}
                setFormState={this.setFormState}
              />
            </Scroll.Element>}

          {this.state.done &&
            <Scroll.Element name={'done'} style={{ width: '100%' }}>
              <StartSignUp formState={s} history={this.props.history} />
            </Scroll.Element>}
        </section>

        {!finished && <div style={{ height: '30%' }} />}
      </div>
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
