import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { toMoney } from 'core/utils/conversionFunctions';
import * as financeConstants from 'core/config/financeConstants';
import { T, IntlNumber, MetricArea } from 'core/components/Translation';
import {
  getPropAndWork,
  getProjectValue,
  getTotalUsed,
  getLoanValue,
  getLenderCount,
  getBorrowRatio,
  getInsuranceFees,
  getMaxBorrowRatio,
} from 'core/utils/loanFunctions';

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
} from '../../utils/borrowerFunctions';
import { getMonthlyPayment, getIncomeRatio } from '../../utils/finance-math';
import RecapSimple from './RecapSimple';

const getDashboardArray = (props) => {
  const r = props.loan;
  const b = props.borrowers;
  const p = props.property;

  const incomeRatio = getIncomeRatio(props);
  const borrowRatio = getBorrowRatio(props);
  const loanValue = getLoanValue(props);
  const project = getProjectValue(props);
  const totalUsed = getTotalUsed(props);
  const propAndWork = getPropAndWork(props);
  const monthly = getMonthlyPayment(props).total;
  const expenses = getExpenses(props);
  const bonusIncome = getBonusIncome(props);
  const otherIncome = getOtherIncome(props);
  const realEstateFortune = getRealEstateFortune(props);
  const realEstateValue = getRealEstateValue(props);
  const realEstateDebt = getRealEstateDebt(props);

  const fortune = getFortune(props);
  const insuranceFortune = getInsuranceFortune(props);
  const totalFortune = getTotalFortune(props);
  const lenderCount = getLenderCount(props);
  const insuranceFees = getInsuranceFees(props);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: { style: { marginTop: 0 } },
    },
    {
      label: 'Recap.purchasePrice',
      value: toMoney(Math.round(p.value)),
    },
    {
      label: 'Recap.propertyWork',
      value: toMoney(Math.round(r.general.propertyWork)),
      hide: !r.general.propertyWork,
      spacing: true,
    },
    {
      label: 'Recap.propAndWork',
      value: <span className="sum">{toMoney(Math.round(propAndWork))}</span>,
      hide: !r.general.propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(p.value * financeConstants.NOTARY_FEES)),
    },
    {
      label: 'general.insuranceFees',
      value: toMoney(Math.round(insuranceFees)),
      hide: !insuranceFees,
    },
    {
      label: 'Recap.totalCost',
      labelStyle: { fontWeight: 400 },
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      title: true,
      label: 'Recap.financing',
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
      value: <span className="sum">{toMoney(totalUsed)}</span>,
      spacingTop: true,
      hide: !r.general.insuranceFortuneUsed,
      bold: true,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loanValue),
    },
    {
      label: 'Recap.totalFinancing',
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
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
      label: r.general.propertyWork
        ? 'Recap.borrowRatio2'
        : 'Recap.borrowRatio1',
      value: (
        <span>
          <IntlNumber value={borrowRatio} format="percentage" />{' '}
          <span
            className={
              borrowRatio <= ,
  getMaxBorrowRatio(r.general.usageType) + 0.001 // add 0.1% to avoid rounding errors
                        ? 'fa fa-check success'
                        : 'fa fa-times error'
                    }
                  />
        </span>
      ),
    },
    {
      label: 'Recap.incomeRatio',
      value: (
        <span>
          <IntlNumber value={incomeRatio} format="percentage" />{' '}
          <span
            className={
              incomeRatio <= 1 / 3
                ? 'fa fa-check success'
                : incomeRatio <= 0.38
                  ? 'fa fa-exclamation warning'
                  : 'fa fa-times error'
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
      value: toMoney(getBorrowerSalary(props)),
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
      value: <span className="sum">{toMoney(getBorrowerIncome(props))}</span>,
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
  const r = props.loan;
  const b = props.borrowers;
  const p = props.property;
  const loanValue = getLoanValue(props);
  const monthly = getMonthlyPayment(props).total;
  const totalUsed = getTotalUsed(props);
  const propAndWork = getPropAndWork(props);
  const project = getProjectValue(props);
  const insuranceFees = getInsuranceFees(props);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: { style: { marginTop: 0 } },
    },
    {
      label: 'Recap.purchasePrice',
      value: toMoney(Math.round(p.value)),
    },
    {
      label: 'Recap.propertyWork',
      value: toMoney(Math.round(r.general.propertyWork)),
      hide: !r.general.propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(p.value * constants.NOTARY_FEES)),
    },
    {
      label: 'general.insuranceFees',
      value: toMoney(Math.round(insuranceFees)),
      hide: !insuranceFees,
    },
    {
      label: 'Recap.totalCost',
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      title: true,
      label: 'Recap.financing',
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loanValue),
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
      label: 'Recap.totalFinancing',
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
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

const getBorrowerArray = (props) => {
  const b = [props.borrower];

  const expenses = getExpenses({ borrowers: b });
  const bonusIncome = getBonusIncome({ borrowers: b });
  const otherIncome = getOtherIncome({ borrowers: b });
  const realEstateFortune = getRealEstateFortune({ borrowers: b });
  const realEstateValue = getRealEstateValue({ borrowers: b });
  const realEstateDebt = getRealEstateDebt({ borrowers: b });
  const fortune = getFortune({ borrowers: b });
  const insuranceFortune = getInsuranceFortune({ borrowers: b });
  const totalFortune = getTotalFortune({ borrowers: b });
  const salary = getBorrowerSalary({ borrowers: b });
  const income = getBorrowerIncome({ borrowers: b });

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
      value: toMoney(salary),
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
      value: <span className="sum">{toMoney(income)}</span>,
      spacingTop: true,
      bold: true,
    },
  ];
};

const getPropertyArray = ({ property }) => {
  const {
    style,
    roomCount,
    insideArea,
    landArea,
    constructionYear,
    renovationYear,
    balconyArea,
    terraceArea,
    investmentRent,
  } = property;

  return [
    {
      title: true,
      label: 'Recap.details',
    },
    {
      label: 'Forms.style',
      value: <T id={`Forms.style.${style}`} />,
    },
    {
      label: 'Forms.roomCount',
      value: roomCount,
      hide: !roomCount,
    },
    {
      label: 'Forms.insideArea',
      value: <MetricArea value={insideArea} />,
      hide: !insideArea,
      spacingTop: true,
    },
    {
      label: 'Forms.landArea',
      value: <MetricArea value={landArea} />,
      hide: !landArea,
    },
    {
      label: 'Forms.balconyArea',
      value: <MetricArea value={balconyArea} />,
      hide: !balconyArea,
    },
    {
      label: 'Forms.terraceArea',
      value: <MetricArea value={terraceArea} />,
      hide: !terraceArea,
    },
    {
      label: 'Forms.constructionYear',
      value: constructionYear,
      hide: !constructionYear,
      spacingTop: true,
    },
    {
      label: 'Forms.renovationYear',
      value: renovationYear,
      hide: !renovationYear,
    },
    {
      label: 'Forms.investmentRent',
      value: toMoney(investmentRent),
      hide: !investmentRent,
      spacingTop: true,
    },
  ];
};

const getStructureArray = (props) => {
  const r = props.loan;
  const b = props.borrowers;
  const p = props.property;

  const project = getProjectValue(props);
  const loanValue = getLoanValue(props);
  const monthly = getMonthlyPayment(props).total;
  const totalUsed = getTotalUsed(props);
  const propAndWork = getPropAndWork(props);
  const lenderCount = getLenderCount(props);
  const incomeRatio = getIncomeRatio(props);
  const borrowRatio = getBorrowRatio(props);
  const insuranceFees = getInsuranceFees(props);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: { style: { marginTop: 0 } },
    },
    {
      label: 'Recap.propAndWork',
      value: toMoney(Math.round(propAndWork)),
      hide: !r.general.propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(p.value * constants.NOTARY_FEES)),
    },
    {
      label: 'general.insuranceFees',
      value: toMoney(Math.round(insuranceFees)),
      hide: !insuranceFees,
    },
    {
      label: 'Recap.totalCost',
      labelStyle: { fontWeight: 400 },
      value: <span className="sum">{toMoney(project)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loanValue),
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
      label: r.general.propertyWork
        ? 'Recap.borrowRatio2'
        : 'Recap.borrowRatio1',
      value: (
        <span>
          <IntlNumber value={borrowRatio} format="percentage" />{' '}
          <span
            className={
              borrowRatio <= getMaxBorrowRatio(r.general.usageType) + 0.001 // add 0.1% to avoid rounding errors
                ? 'fa fa-check success'
                : 'fa fa-times error'
            }
          />
        </span>
      ),
    },
    {
      label: 'Recap.incomeRatio',
      value: (
        <span>
          <IntlNumber value={incomeRatio} format="percentage" />{' '}
          <span
            className={
              incomeRatio <= 1 / 3
                ? 'fa fa-check success'
                : incomeRatio <= 0.38
                  ? 'fa fa-exclamation warning'
                  : 'fa fa-times error'
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
  case 'dashboard':
    return getDashboardArray(props);
  case 'dashboard-small':
    return getSmallDashboardArray(props);
  case 'borrower':
    return getBorrowerArray(props);
  case 'structure':
    return getStructureArray(props);
  case 'property':
    return getPropertyArray(props);
  default:
    throw new Meteor.Error('Not a valid recap array');
  }
};

const Recap = (props) => {
  const array = props.array || arraySwitch(props);
  return (
    <article className="validator recap">
      <RecapSimple {...props} array={array} />
    </article>
  );
};

Recap.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  borrower: PropTypes.objectOf(PropTypes.any),
  array: PropTypes.arrayOf(PropTypes.object),
  noScale: PropTypes.bool,
};

Recap.defaultProps = {
  loan: {},
  borrowers: [{}],
  borrower: {},
  array: undefined,
  noScale: false,
};

export default Recap;
