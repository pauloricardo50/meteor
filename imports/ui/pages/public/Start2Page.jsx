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
  getRetirement,
  getMaxLoan,
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
  }

  setActiveLine = id => {
    if (this.state.activeLine !== id) {
      this.setState({ activeLine: id });
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
            <h1>Allons vous obtenir ce prêt hypothécaire</h1>
            <h2><small>Prenez 2 minutes pour nous en dire un peu plus sur vous</small></h2>
          </div>
          <div>
            <RaisedButton
              label="C'est parti"
              primary
              onClick={() => Meteor.setTimeout(() => this.setState({ showUX: false }), 400)}
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
    const props = {
      formState: s,
      type: s.type,
      usageType: s.usageType,
      property,
      propertyWork: s.propertyWork || 0,
      propAndWork: property + (s.propertyWork || 0),
      salary: (s.income1 || 0) + (s.income2 || 0),
      bonus: getBonusIncome([s.bonus11, s.bonus21, s.bonus31, s.bonus41]) +
        getBonusIncome([s.bonus12, s.bonus22, s.bonus32, s.bonus42]),
      income: getIncome(s) || 0,
      otherIncome: getOtherIncome(s.otherIncomeArray) || 0,
      fortune: getFortune(s) || 0,
      insuranceFortune: s.insuranceConditions !== false ? getInsuranceFortune(s) || 0 : 0,
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
    props.minCash = fees + 0.1 * props.propAndWork + 0.1 * props.propAndWork * constants.lppFees;
    props.fortuneNeeded = props.project - s.loanWanted;
    props.totalFortune = props.fortune + props.insuranceFortune;
    props.borrow = getBorrow(
      props.fortuneUsed + props.insuranceFortuneUsed,
      props.propAndWork,
      props.fees + props.lppFees,
    );
    props.monthly = getMonthly(s, props.borrow, toRetirement) || 0;
    props.monthlyReal = getMonthlyReal(s, props.borrow, toRetirement) || 0;
    props.ratio = getRatio(props.income, props.expenses, props.monthly);
    props.lenderCount = getLenderCount(props.borrow, props.ratio);

    // if you want to have a minimum loan, you use all your fortune, hence, you'll have to pay maximum lppFees
    // Round up to make sure the project works
    props.minLoan = Math.round(
      props.propAndWork - (props.fortune + props.insuranceFortune * (1 - constants.lppFees)) + fees,
    );
    // If the income is too low to afford a loan higher than some amount
    props.maxLoan = getMaxLoan(
      s,
      props.income,
      props.fortune,
      props.insuranceFortune,
      toRetirement,
      props.propAndWork,
    );
    props.minFortune =
      fees + (1 - constants.maxLoan(s.usageType, props.toRetirement)) * props.propAndWork;

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
        props.toRetirement,
      );
    }

    const finished = isFinished(s, props.minFortune);

    return (
      <div style={{ height: 'inherit', width: 'inherit' }}>
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
            <div className="start2recap mask1 animated fadeInUp">
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
