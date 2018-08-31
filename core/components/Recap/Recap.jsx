import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { toMoney } from '../../utils/conversionFunctions';
import { T, IntlNumber, MetricArea } from '../Translation';
import RecapSimple from './RecapSimple';
import Calculator from '../../utils/Calculator';
import BorrowerCalculator from '../../utils/Calculator/BorrowerCalculator';

const getDashboardArray = (props) => {
  const bonusIncome = Calculator.getBonusIncome(props);
  const borrowerIncome = Calculator.getTotalIncome(props);
  const borrowRatio = Calculator.getBorrowRatio(props);
  const expenses = Calculator.getExpenses(props);
  const fortune = Calculator.getFortune(props);
  const fortuneUsed = Calculator.makeSelectStructureKey('fortuneUsed')(props);
  const incomeRatio = Calculator.getIncomeRatio(props);
  const insuranceFortune = Calculator.getInsuranceFortune(props);
  const insurancePledged = Calculator.getInsuranceWithdrawn(props);
  const insuranceWithdrawn = Calculator.getInsuranceWithdrawn(props);
  const loanValue = Calculator.selectLoanValue(props);
  const maxBorrowRatio = Calculator.getMaxBorrowRatio(props);
  const monthly = Calculator.getMonthly(props);
  const notaryFees = Calculator.getFees(props);
  const otherIncome = Calculator.getOtherIncome(props);
  const project = Calculator.getProjectValue(props);
  const propAndWork = Calculator.getPropAndWork(props);
  const propertyValue = Calculator.selectPropertyValue(props);
  const propertyWork = Calculator.makeSelectStructureKey('propertyWork')(props);
  const realEstateDebt = Calculator.getRealEstateDebt(props);
  const realEstateFortune = Calculator.getRealEstateFortune(props);
  const realEstateValue = Calculator.getRealEstateValue(props);
  const totalFunds = Calculator.getTotalFunds(props);
  const totalUsed = Calculator.getTotalUsed(props);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: { style: { marginTop: 0 } },
    },
    {
      label: 'Recap.purchasePrice',
      value: toMoney(Math.round(propertyValue)),
    },
    {
      label: 'Recap.propertyWork',
      value: toMoney(Math.round(propertyWork)),
      hide: !propertyWork,
      spacing: true,
    },
    {
      label: 'Recap.propAndWork',
      value: <span className="sum">{toMoney(Math.round(propAndWork))}</span>,
      hide: !propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(notaryFees)),
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
      hide: insuranceWithdrawn,
    },
    {
      label: 'Recap.ownFundsCash',
      value: toMoney(fortuneUsed),
      hide: !insuranceWithdrawn,
    },
    {
      label: 'Recap.ownFundsInsuranceWithdrawal',
      value: toMoney(insuranceWithdrawn),
      hide: !insuranceWithdrawn,
    },
    {
      label: 'Recap.ownFundsInsurancePledged',
      value: toMoney(insurancePledged),
      hide: !insurancePledged,
    },
    {
      label: 'Recap.ownFundsTotal',
      value: <span className="sum">{toMoney(totalUsed)}</span>,
      spacingTop: true,
      hide: !insuranceWithdrawn,
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
      label: propertyWork ? 'Recap.borrowRatio2' : 'Recap.borrowRatio1',
      value: (
        <span>
          <IntlNumber value={borrowRatio} format="percentage" />{' '}
          <span
            className={
              borrowRatio <= maxBorrowRatio + 0.001 // add 0.1% to avoid rounding errors
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
      value: <span className="sum">{toMoney(totalFunds)}</span>,
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
        <span className="sum">{toMoney(totalFunds + realEstateFortune)}</span>
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
      value: toMoney(borrowerIncome),
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
      value: <span className="sum">{toMoney(borrowerIncome)}</span>,
      spacingTop: true,
      bold: true,
    },
    {
      title: true,
      label: 'general.lenders',
    },
  ];
};

const getBorrowerArray = ({ borrower: borrowers }) => {
  const expenses = BorrowerCalculator.getExpenses({ borrowers });
  const bonusIncome = BorrowerCalculator.getBonusIncome({ borrowers });
  const otherIncome = BorrowerCalculator.getOtherIncome({ borrowers });
  const otherFortune = BorrowerCalculator.getOtherFortune({ borrowers });
  const realEstateFortune = BorrowerCalculator.getRealEstateFortune({
    borrowers,
  });
  const realEstateValue = BorrowerCalculator.getRealEstateValue({
    borrowers,
  });
  const realEstateDebt = BorrowerCalculator.getRealEstateDebt({ borrowers });
  const fortune = BorrowerCalculator.getFortune({ borrowers });
  const insuranceFortune = BorrowerCalculator.getInsuranceFortune({
    borrowers,
  });
  const totalFunds = BorrowerCalculator.getTotalFunds({ borrowers });
  const salary = BorrowerCalculator.getSalary({ borrowers });
  const income = BorrowerCalculator.getTotalIncome({ borrowers });

  const netFortune = totalFunds + realEstateFortune + otherFortune;

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
      value: <span className="sum">{toMoney(totalFunds)}</span>,
      spacingTop: true,
      bold: true,
      spacing: true,
    },
    {
      label: 'Recap.realEstate',
      value: toMoney(realEstateValue),
      hide: !realEstateFortune,
    },
    {
      label: 'Recap.realEstateLoans',
      value: `- ${toMoney(realEstateDebt)}`,
      hide: !realEstateFortune,
    },
    {
      label: 'Recap.otherFortune',
      value: `${toMoney(otherFortune)}`,
      hide: !otherFortune,
    },
    {
      label: 'Recap.netFortune',
      value: <span className="sum">{toMoney(netFortune)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
      hide: !realEstateFortune && !otherFortune,
    },
    {
      title: true,
      label: 'general.income',
      spacingTop: true,
    },
    {
      label: 'general.salary',
      value: toMoney(salary),
    },
    {
      label: 'Recap.consideredBonus',
      value: toMoney(bonusIncome),
      hide: !borrowers.bonusExists,
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
    propertyType,
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
      label: 'Forms.propertyType',
      value: <T id={`Forms.propertyType.${propertyType}`} />,
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
  const borrowRatio = Calculator.getBorrowRatio(props);
  const incomeRatio = Calculator.getIncomeRatio(props);
  const loanValue = Calculator.selectLoanValue(props);
  const maxBorrowRatio = Calculator.getMaxBorrowRatio(props);
  const monthly = Calculator.getMonthly(props);
  const project = Calculator.getProjectValue(props);
  const propAndWork = Calculator.getPropAndWork(props);
  const propertyValue = Calculator.selectPropertyValue(props);
  const propertyWork = Calculator.makeSelectStructureKey('propertyWork')(props);
  const totalUsed = Calculator.getTotalUsed(props);

  return [
    {
      title: true,
      label: 'Recap.title',
      props: { style: { marginTop: 0 } },
    },
    {
      label: 'Recap.propAndWork',
      value: toMoney(Math.round(propAndWork)),
      hide: !propertyWork,
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Math.round(propertyValue * Calculator.notaryFees)),
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
      label: propertyWork ? 'Recap.borrowRatio2' : 'Recap.borrowRatio1',
      value: (
        <span>
          <IntlNumber value={borrowRatio} format="percentage" />{' '}
          <span
            className={
              borrowRatio <= maxBorrowRatio + 0.001 // add 0.1% to avoid rounding errors
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
  ];
};

const arraySwitch = (props) => {
  switch (props.arrayName) {
  case 'start1':
    return null;
  case 'dashboard':
    return getDashboardArray(props);
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
  array: PropTypes.arrayOf(PropTypes.object),
  borrower: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  loan: PropTypes.objectOf(PropTypes.any),
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
