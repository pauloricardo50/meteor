import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

import { toMoney } from '/imports/js/helpers/conversionFunctions';
import constants from '/imports/js/config/constants';
import AutoTooltip from './AutoTooltip';
import { T } from '/imports/ui/components/general/Translation';

import {
  getPropAndWork,
  getProjectValue,
  getTotalUsed,
  getLoanValue,
  getLenderCount,
  getBorrowRatio,
} from '/imports/js/helpers/requestFunctions';

import {
  getExpenses,
  getBorrowerIncome,
  getRealEstateFortune,
  getTotalFortune,
  getRealEstateDebt,
  getFortune,
  getBonusIncome,
  getOtherIncome,
  getBorrowerSalary,
  getRealEstateValue,
  getInsuranceFortune,
} from '/imports/js/helpers/borrowerFunctions';

import {
  getMonthlyPayment,
  getIncomeRatio,
} from '/imports/js/helpers/finance-math';

const getDashboardArray = (props) => {
  const r = props.loanRequest;
  const b = props.borrowers;

  const incomeRatio = getIncomeRatio(r, b);
  const borrowRatio = getBorrowRatio(r, b);
  const loan = getLoanValue(r);
  const project = getProjectValue(r);
  const totalUsed = getTotalUsed(r);
  const propAndWork = getPropAndWork(r);
  const monthly = getMonthlyPayment(r, b).total;
  const expenses = getExpenses(b);
  const bonusIncome = getBonusIncome(b);
  const otherIncome = getOtherIncome(b);
  const realEstateFortune = getRealEstateFortune(b);
  const realEstateValue = getRealEstateValue(b);
  const realEstateDebt = getRealEstateDebt(b);

  const fortune = getFortune(b);
  const insuranceFortune = getInsuranceFortune(b);
  const totalFortune = getTotalFortune(b);
  const lenderCount = getLenderCount(r, b);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: 'Recap.purchasePrice',
      value: toMoney(Math.round(r.property.value)),
    },
    {
      label: 'Recap.propertyWork',
      value: toMoney(Math.round(r.property.propertyWork)),
      hide: !r.property.propertyWork,
      spacing: true,
    },
    {
      label: 'Recap.propAndWork',
      value: toMoney(Math.round(propAndWork)),
      hide: !r.property.propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(r.property.value * constants.notaryFees)),
    },
    {
      label: 'general.insuranceFees',
      value: toMoney(
        Math.round(r.general.insuranceFortuneUsed * constants.lppFees),
      ),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.totalCost',
      labelStyle: {
        fontWeight: 400,
      },
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      label: 'general.ownFunds',
      value: toMoney(totalUsed),
      hide: r.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsCash',
      value: toMoney(r.general.fortuneUsed),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsInsurance',
      value: toMoney(r.general.insuranceFortuneUsed),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsTotal',
      value: <span className="sum">{toMoney(getTotalUsed(r))}</span>,
      spacingTop: true,
      hide: !r.general.insuranceFortuneUsed,
      bold: true,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loan),
    },
    {
      label: 'Recap.monthlyCost',
      value: (
        <span>
          {toMoney(monthly)} <small>/mois</small>
        </span>
      ),
    },
    {
      title: true,
      label: 'Recap.finmaRules',
    },
    {
      label: r.property.propertyWork
        ? 'Recap.borrowRatio2'
        : 'Recap.borrowRatio1',
      value: (
        <span>
          {Math.round(borrowRatio * 1000) / 10}%{' '}
          <span
            className={
              borrowRatio <= constants.maxLoan(r.property.usageType) + 0.001 ? ( // add 0.1% to avoid rounding errors
                'fa fa-check success'
              ) : (
                'fa fa-times error'
              )
            }
          />
        </span>
      ),
    },
    {
      label: 'Recap.incomeRatio',
      value: (
        <span>
          {Math.round(incomeRatio * 1000) / 10}%{' '}
          <span
            className={
              incomeRatio <= 1 / 3 ? (
                'fa fa-check success'
              ) : incomeRatio <= 0.38 ? (
                'fa fa-exclamation warning'
              ) : (
                'fa fa-times error'
              )
            }
          />
        </span>
      ),
    },
    {
      title: true,
      label: 'Recap.fortune',
      hide: !(realEstateFortune || insuranceFortune),
    },
    {
      label: 'Recap.bankFortune',
      value: toMoney(fortune),
    },
    {
      label: 'Recap.insuranceFortune',
      value: toMoney(insuranceFortune),
      hide: !insuranceFortune,
    },
    {
      label: 'Recap.availableFunds',
      value: <span className="sum">{toMoney(totalFortune)}</span>,
      hide: !realEstateFortune,
      spacingTop: true,
      bold: true,
    },
    {
      label: 'Recap.realEstate',
      value: toMoney(realEstateValue),
      hide: !realEstateFortune,
      spacingTop: true,
    },
    {
      label: 'Recap.realEstateLoans',
      value: `- ${toMoney(realEstateDebt)}`,
      hide: !realEstateFortune,
    },
    {
      label: 'Recap.netFortune',
      value: (
        <span className="sum">{toMoney(totalFortune + realEstateFortune)}</span>
      ),
      spacingTop: true,
      hide: !realEstateFortune,
    },
    {
      title: true,
      label: 'general.income',
    },
    {
      label: 'general.salary',
      value: toMoney(getBorrowerSalary(b)),
    },
    {
      label: 'Recap.consideredBonus',
      value: toMoney(bonusIncome),
      hide: !bonusIncome,
    },
    {
      label: 'Recap.otherIncome',
      value: toMoney(otherIncome),
      hide: !otherIncome,
    },
    {
      label: 'Recap.expenses',
      value: `- ${toMoney(expenses)}`,
      hide: !expenses,
    },
    {
      label: 'Recap.consideredIncome',
      value: <span className="sum">{toMoney(getBorrowerIncome(b))}</span>,
      spacingTop: true,
      bold: true,
    },
    {
      title: true,
      label: 'general.lenders',
    },
    {
      label: 'Recap.interestedLenders',
      value: lenderCount,
      spacing: true,
    },
  ];
};

const getSmallDashboardArray = (props) => {
  const r = props.loanRequest;
  const b = props.borrowers;
  const loan = getLoanValue(r);
  const monthly = getMonthlyPayment(r, b).total;
  const totalUsed = getTotalUsed(r);
  const propAndWork = getPropAndWork(r);
  const project = getProjectValue(r);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loan),
    },
    {
      label: 'Recap.ownFundsTotal',
      value: toMoney(totalUsed),
    },
    {
      label:
        r.property.value === propAndWork
          ? 'Recap.purchasePrice'
          : 'Recap.propAndWork',
      value: toMoney(Math.round(propAndWork)),
    },
    {
      label: 'Recap.totalCost',
      value: toMoney(project),
      spacing: true,
    },
    {
      label: 'Recap.monthlyCost',
      value: (
        <span>
          {toMoney(monthly)} <small>/mois</small>
        </span>
      ),
    },
  ];
};

const getStart2Array = (props) => {
  const p = props;

  return [
    {
      title: true,
      label: 'Recap.title',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label:
        p.type === 'test' ? 'Recap.purchasePrice' : 'Recap.maxPurchasePrice',
      value: toMoney(Math.round(p.property)),
    },
    {
      label: 'Recap.propertyWork',
      value: toMoney(Math.round(p.propertyWork)),
      hide: !p.propertyWork,
      spacing: true,
    },
    {
      label: 'Recap.propAndWork',
      value: toMoney(Math.round(p.propAndWork)),
      hide: !p.propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(p.property * constants.notaryFees)),
    },
    {
      label: 'general.insuranceFees',
      value: toMoney(Math.round(p.lppFees)),
      hide: !p.insuranceFortuneUsed,
    },
    {
      label: 'Recap.totalCost',
      labelStyle: {
        fontWeight: 400,
      },
      value: (
        <span className="bold sum">
          {toMoney(
            Math.round(
              p.property * (1 + constants.notaryFees) +
                p.propertyWork +
                p.lppFees,
            ),
          )}
        </span>
      ),
      spacingTop: true,
      spacing: p.fortuneUsed,
    },
    {
      label: 'general.ownFunds',
      value: toMoney(Math.round(p.fortuneUsed)),
      hide: !p.fortuneUsed || p.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsCash',
      value: toMoney(p.fortuneUsed),
      hide: !p.fortuneUsed || !p.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsInsurance',
      value: toMoney(p.insuranceFortuneUsed),
      hide: !p.fortuneUsed || !p.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsTotal',
      value: (
        <span className="sum">
          {toMoney(Math.round(p.fortuneUsed + p.insuranceFortuneUsed))}
        </span>
      ),
      spacingTop: true,
      hide: !p.fortuneUsed || !p.insuranceFortuneUsed,
      bold: true,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(Math.round(p.loanWanted)),
      hide: !p.loanWanted,
      spacing: !p.loanWanted,
    },
    {
      label: 'Recap.monthlyCost',
      value: (
        <span>
          {toMoney(Math.round(p.monthlyReal))} <small>/mois</small>
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'Recap.finmaRules',
      hide: !p.fortuneUsed,
    },
    {
      label: p.propertyWork ? 'Recap.borrowRatio2' : 'Recap.borrowRatio1',
      value: (
        <span>
          {Math.round(p.borrow * 1000) / 10}%{' '}
          <span
            className={
              p.borrow <= constants.maxLoan(p.usageType) + 0.001 ? ( // add 0.1% to avoid rounding errors
                'fa fa-check success'
              ) : (
                'fa fa-times error'
              )
            }
          />
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      label: 'Recap.incomeRatio',
      value: (
        <span>
          {Math.round(p.ratio * 1000) / 10}%{' '}
          <span
            className={
              p.ratio <= 1 / 3 ? (
                'fa fa-check success'
              ) : p.ratio <= 0.38 ? (
                'fa fa-exclamation warning'
              ) : (
                'fa fa-times error'
              )
            }
          />
        </span>
      ),
      hide: !p.fortuneUsed,
    },
    {
      title: true,
      label: 'Recap.fortune',
      hide: !(p.fortune || p.realEstate || p.insuranceFortune),
    },
    {
      label: 'Recap.bankFortune',
      value: toMoney(Math.round(p.fortune)),
      hide: !p.fortune,
    },

    {
      label: 'Recap.insuranceFortune',
      value: toMoney(Math.round(p.insuranceFortuneDisplayed)),
      hide: !p.insuranceFortuneDisplayed,
    },
    {
      label: 'Recap.availableFunds',
      value: (
        <span className="sum">
          {toMoney(Math.round(p.fortune + p.insuranceFortuneDisplayed))}
        </span>
      ),
      hide: !p.insuranceFortuneDisplayed,
      spacingTop: true,
      bold: true,
    },
    {
      label: 'Recap.realEstate',
      value: toMoney(Math.round(p.realEstateValue)),
      hide: !p.realEstate,
      spacingTop: true,
    },
    {
      label: 'Recap.realEstateLoans',
      value: `- ${toMoney(Math.round(p.realEstateDebt))}`,
      hide: !p.realEstate,
    },

    {
      label: 'Recap.netFortune',
      value: (
        <span className="sum">
          {toMoney(
            Math.round(p.fortune + p.insuranceFortuneDisplayed + p.realEstate),
          )}
        </span>
      ),
      spacingTop: true,
      hide: !p.realEstate,
      bold: true,
    },
    {
      title: true,
      label: 'general.income',
      hide: !(
        p.salary ||
        p.bonus ||
        p.otherIncome ||
        p.expenses ||
        p.propertyRent
      ),
    },
    {
      label: 'Recap.receivedRent',
      value: toMoney(Math.round(p.propertyRent * 12)),
      hide: p.usageType !== 'investment',
    },
    {
      label: 'general.salary',
      value: toMoney(Math.round(p.salary)),
      hide: !p.salary,
    },
    {
      label: 'Recap.consideredBonus',
      value: toMoney(Math.round(p.bonus)),
      hide: !p.bonus,
    },
    {
      label: 'Recap.otherIncome',
      value: toMoney(Math.round(p.otherIncome)),
      hide: !p.otherIncome,
    },
    {
      label: 'Recap.expenses',
      value: `- ${toMoney(Math.round(p.expenses))}`,
      hide: !p.expenses,
    },
    {
      label: 'Recap.consideredIncome',
      value: (
        <span className="sum">
          {toMoney(Math.round(p.income - p.expenses))}
        </span>
      ),
      hide: !(p.salary || p.bonus || p.otherIncome || p.expenses),
      spacingTop: true,
      bold: true,
    },
    {
      title: true,
      label: 'e-Potek',
    },
    {
      label: 'Recap.interestedLenders',
      value: p.lenderCount,
      spacing: true,
    },
  ];
};

const getBorrowerArray = (props) => {
  const b = [props.borrower];

  const expenses = getExpenses(b);
  const bonusIncome = getBonusIncome(b);
  const otherIncome = getOtherIncome(b);
  const realEstateFortune = getRealEstateFortune(b);
  const realEstateValue = getRealEstateValue(b);
  const realEstateDebt = getRealEstateDebt(b);
  const fortune = getFortune(b);
  const insuranceFortune = getInsuranceFortune(b);
  const totalFortune = getTotalFortune(b);

  return [
    {
      title: true,
      label: 'Recap.fortune',
      hide: !(realEstateFortune && insuranceFortune),
    },
    {
      label: 'Recap.bankFortune',
      value: toMoney(fortune),
    },

    {
      label: 'Recap.insuranceFortune',
      value: toMoney(insuranceFortune),
      hide: !insuranceFortune,
    },
    {
      label: 'Recap.availableFunds',
      value: <span className="sum">{toMoney(totalFortune)}</span>,
      hide: !realEstateFortune,
      spacingTop: true,
      bold: true,
    },
    {
      label: 'Recap.realEstate',
      value: toMoney(realEstateValue),
      hide: !realEstateFortune,
      spacingTop: true,
    },
    {
      label: 'Recap.realEstateLoans',
      value: `- ${toMoney(realEstateDebt)}`,
      hide: !realEstateFortune,
    },
    {
      label: 'Recap.netFortune',
      value: (
        <span className="sum">{toMoney(totalFortune + realEstateFortune)}</span>
      ),
      spacingTop: true,
      hide: !realEstateFortune,
    },
    {
      title: true,
      label: 'general.income',
    },
    {
      label: 'general.salary',
      value: toMoney(getBorrowerSalary(b)),
    },
    {
      label: 'Recap.consideredBonus',
      value: toMoney(bonusIncome),
      hide: !bonusIncome,
    },
    {
      label: 'Recap.otherIncome',
      value: toMoney(otherIncome),
      hide: !otherIncome,
    },
    {
      label: 'Recap.expenses',
      value: `- ${toMoney(expenses)}`,
      hide: !expenses,
    },
    {
      label: 'Recap.consideredIncome',
      value: <span className="sum">{toMoney(getBorrowerIncome(b))}</span>,
      spacingTop: true,
      bold: true,
    },
  ];
};

const getStructureArray = (props) => {
  const r = props.loanRequest;
  const b = props.borrowers;
  const project = getProjectValue(r);
  const loan = getLoanValue(r);
  const monthly = getMonthlyPayment(r, b).total;
  const totalUsed = getTotalUsed(r);
  const propAndWork = getPropAndWork(r);
  const lenderCount = getLenderCount(r, b);
  const incomeRatio = getIncomeRatio(r, b);
  const borrowRatio = getBorrowRatio(r, b);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: {
        style: {
          marginTop: 0,
        },
      },
    },
    {
      label: 'Recap.propAndWork',
      value: toMoney(Math.round(propAndWork)),
      hide: !r.property.propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(r.property.value * constants.notaryFees)),
    },
    {
      label: 'general.insuranceFees',
      value: toMoney(
        Math.round(r.general.insuranceFortuneUsed * constants.lppFees),
      ),
      hide: !r.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.totalCost',
      labelStyle: {
        fontWeight: 400,
      },
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loan),
    },
    {
      label: 'Recap.ownFundsTotal',
      value: toMoney(totalUsed),
      spacing: true,
    },
    {
      label: 'Recap.monthlyCost',
      value: (
        <span>
          {toMoney(monthly)} <small>/mois</small>
        </span>
      ),
    },
    {
      title: true,
      label: 'Recap.finmaRules',
    },
    {
      label: r.property.propertyWork
        ? 'Recap.borrowRatio2'
        : 'Recap.borrowRatio1',
      value: (
        <span>
          {Math.round(borrowRatio * 1000) / 10}%{' '}
          <span
            className={
              borrowRatio <= constants.maxLoan(r.property.usageType) + 0.001 ? ( // add 0.1% to avoid rounding errors
                'fa fa-check success'
              ) : (
                'fa fa-times error'
              )
            }
          />
        </span>
      ),
    },
    {
      label: 'Recap.incomeRatio',
      value: (
        <span>
          {Math.round(incomeRatio * 1000) / 10}%{' '}
          <span
            className={
              incomeRatio <= 1 / 3 ? (
                'fa fa-check success'
              ) : incomeRatio <= 0.38 ? (
                'fa fa-exclamation warning'
              ) : (
                'fa fa-times error'
              )
            }
          />
        </span>
      ),
      spacing: true,
    },
    {
      label: 'Recap.interestedLenders',
      value: lenderCount,
      spacing: true,
    },
  ];
};

const arraySwitch = (props) => {
  switch (props.arrayName) {
    case 'start1':
      return null;
    case 'start2':
      return getStart2Array(props);
    case 'dashboard':
      return getDashboardArray(props);
    case 'dashboard-small':
      return getSmallDashboardArray(props);
    case 'borrower':
      return getBorrowerArray(props);
    case 'structure':
      return getStructureArray(props);
    default:
      throw new Meteor.Error('Not a valid recap array');
  }
};

const Recap = (props) => {
  const array = props.array || arraySwitch(props);
  return (
    <article className="validator">
      <div className="result animated fadeIn">
        {array.map((item) => {
          if (item.hide) {
            return null;
          } else if (item.title) {
            return (
              <label
                className="text-center"
                {...item.props}
                key={item.label}
                style={item.labelStyle}
              >
                <T id={item.label} />
              </label>
            );
          }
          return (
            <div
              className={classnames({
                'fixed-size': true,
                'no-scale': props.noScale,
                bold: item.bold,
              })}
              style={{
                marginBottom: item.spacing && 16,
                marginTop: item.spacingTop && 16,
              }}
              key={item.label}
            >
              <h4 className="secondary">
                <T id={item.label} tooltipPlacement="bottom" />
              </h4>
              <h3 {...item.props}>{item.value}</h3>
            </div>
          );
        })}
      </div>
    </article>
  );
};

Recap.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  borrower: PropTypes.objectOf(PropTypes.any),
  array: PropTypes.arrayOf(PropTypes.object),
  noScale: PropTypes.bool,
};

Recap.defaultProps = {
  loanRequest: {},
  borrowers: [{}],
  borrower: {},
  array: undefined,
  noScale: false,
};

export default Recap;
