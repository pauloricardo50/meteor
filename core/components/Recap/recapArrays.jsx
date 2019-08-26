import { Meteor } from 'meteor/meteor';

import React from 'react';
import { ERROR, SUCCESS } from 'core/api/constants';
import Calculator from '../../utils/Calculator';
import { T, Percent, MetricArea } from '../Translation';
import { toMoney } from '../../utils/conversionFunctions';
import PercentWithStatus from '../PercentWithStatus/PercentWithStatus';

export const getDashboardArray = ({ Calculator: calc = Calculator, loan }) => {
  const bonusIncome = calc.getBonusIncome({ loan });
  const borrowRatio = calc.getBorrowRatio({ loan });
  const fortune = calc.getFortune({ loan });
  const incomeRatio = calc.getIncomeRatio({ loan });
  const insuranceFortune = calc.getInsuranceFortune({ loan });
  const loanValue = calc.selectLoanValue({ loan });
  const maxBorrowRatio = calc.getMaxBorrowRatio({ loan });
  const monthly = calc.getMonthly({ loan });
  const notaryFees = calc.getFees({ loan }).total;
  const otherIncome = calc.getOtherIncome({ loan });
  const ownFundsNonPledged = calc.getNonPledgedOwnFunds({ loan });
  const ownFundsPledged = calc.getTotalPledged({ loan });
  const project = calc.getProjectValue({ loan });
  const propAndWork = calc.getPropAndWork({ loan });
  const propertyValue = calc.selectPropertyValue({ loan });
  const propertyWork = calc.selectStructureKey({
    loan,
    key: 'propertyWork',
  });
  const realEstateDebt = calc.getRealEstateDebt({ loan });
  const realEstateFortune = calc.getRealEstateFortune({ loan });
  const realEstateIncome = calc.getRealEstateIncomeTotal({ loan });
  const realEstateValue = calc.getRealEstateValue({ loan });
  const salary = calc.getSalary({ loan });
  const expenses = calc.getFormattedExpenses({ loan }).subtract;
  const totalFinancing = calc.getTotalFinancing({ loan });
  const totalFunds = calc.getTotalFunds({ loan });
  const totalIncome = calc.getTotalIncome({ loan });

  return [
    {
      title: true,
      label: (
        <span>
          <T id="Recap.title" />
          &nbsp;
          {Meteor.microservice === 'admin' && calc.organisationName && (
            <span className="secondary">
              (
              <T
                id="Recap.consideredBy"
                values={{ organisationName: calc.organisationName }}
              />
              )
            </span>
          )}
        </span>
      ),
      props: { style: { marginTop: 0 } },
      noIntl: true,
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
      value: toMoney(ownFundsNonPledged),
    },
    {
      label: 'Recap.ownFundsPledged',
      value: toMoney(ownFundsPledged),
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loanValue),
    },
    {
      label: 'Recap.totalFinancing',
      value: <span className="sum">{toMoney(totalFinancing)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      label: 'Recap.monthlyCost',
      value: (
        <span>
          {toMoney(monthly)}
          {' '}
          <small>/mois</small>
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
        <span className="flex center">
          <PercentWithStatus
            value={borrowRatio}
            status={borrowRatio > maxBorrowRatio ? ERROR : SUCCESS}
          />
        </span>
      ),
    },
    {
      label: 'Recap.incomeRatio',
      value: (
        <span className="flex center">
          <PercentWithStatus
            value={incomeRatio}
            status={incomeRatio > calc.maxIncomeRatio ? ERROR : SUCCESS}
          />
        </span>
      ),
    },
    {
      title: true,
      label: 'Recap.fortune',
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
      label: 'Recap.realEstateIncome',
      value: `- ${toMoney(realEstateIncome)}`,
      hide: !realEstateIncome,
    },
    {
      label: 'Recap.expenses',
      value: `- ${toMoney(expenses)}`,
      hide: !expenses,
    },
    {
      label: 'Recap.consideredIncome',
      value: <span className="sum">{toMoney(totalIncome)}</span>,
      spacingTop: true,
      bold: true,
    },
    {
      title: true,
      label: 'general.lenders',
    },
  ];
};

export const getBorrowerArray = ({
  Calculator: calc = Calculator,
  borrower: borrowers,
}) => {
  const bonusIncome = calc.getBonusIncome({ borrowers });
  const fortune = calc.getFortune({ borrowers });
  const insuranceFortune = calc.getInsuranceFortune({ borrowers });
  const netSalary = calc.getNetSalary({ borrowers });
  const otherFortune = calc.getOtherFortune({ borrowers });
  const otherIncome = calc.getOtherIncome({ borrowers });
  const realEstateDebt = calc.getRealEstateDebt({ borrowers });
  const realEstateFortune = calc.getRealEstateFortune({ borrowers });
  const realEstateIncome = calc.getRealEstateIncomeTotal({ borrowers });
  const realEstateValue = calc.getRealEstateValue({ borrowers });
  const salary = calc.getSalary({ borrowers });
  const thirdPartyFortune = calc.getThirdPartyFortune({ borrowers });
  const totalFunds = calc.getTotalFunds({ borrowers });
  const totalIncome = calc.getTotalIncome({ borrowers });
  const expenses = calc.getFormattedExpenses({ borrowers }).subtract;
  const donation = calc.getDonationFortune({ borrowers });

  const netFortune = totalFunds + realEstateFortune + otherFortune;

  return [
    {
      title: true,
      label: (
        <span className="v-align-recap">
          <T id="Recap.fortune" />
          &nbsp;
          {Meteor.microservice === 'admin' && calc.organisationName && (
            <span className="secondary">
              (
              <T
                id="Recap.consideredBy"
                values={{ organisationName: calc.organisationName }}
              />
              )
            </span>
          )}
        </span>
      ),
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
      label: 'Recap.thirdPartyFortune',
      value: toMoney(thirdPartyFortune),
      hide: !thirdPartyFortune,
    },
    {
      label: 'Recap.donation',
      value: toMoney(donation),
      hide: !donation,
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
      label: 'Recap.netRealEstate',
      value: (
        <span className="sum">{toMoney(realEstateValue - realEstateDebt)}</span>
      ),
      spacingTop: true,
      spacing: true,
      bold: true,
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
      bold: true,
      hide: !realEstateFortune && !otherFortune,
    },
    {
      title: true,
      label: 'general.income',
      spacingTop: true,
      className: 'v-align-recap-income',
    },
    {
      label: 'general.salary',
      value: toMoney(salary),
    },
    {
      label: 'Recap.netSalary',
      value: <span className="secondary">{toMoney(netSalary)}</span>,
      hide: !netSalary,
      spacing: true,
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
      label: 'Recap.realEstateIncome',
      value: toMoney(realEstateIncome),
      hide: !realEstateIncome,
    },
    {
      label: 'Recap.expenses',
      value: `- ${toMoney(expenses)}`,
      hide: !expenses,
    },
    {
      label: 'Recap.consideredIncome',
      value: <span className="sum">{toMoney(totalIncome)}</span>,
      spacingTop: true,
      bold: true,
    },
  ];
};

export const getPropertyArray = ({ property }) => {
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

export const getStructureArray = (props) => {
  const borrowRatio = Calculator.getBorrowRatio(props);
  const incomeRatio = Calculator.getIncomeRatio(props);
  const loanValue = Calculator.selectLoanValue(props);
  const maxBorrowRatio = Calculator.getMaxBorrowRatio(props);
  const monthly = Calculator.getMonthly(props);
  const project = Calculator.getProjectValue(props);
  const propAndWork = Calculator.getPropAndWork(props);
  const propertyWork = Calculator.makeSelectStructureKey('propertyWork')(props);
  const totalUsed = Calculator.getTotalUsed(props);
  const notaryFees = Calculator.getFees(props).total;

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
          {toMoney(monthly)}
          {' '}
          <small>/mois</small>
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
          <Percent value={borrowRatio} />
          {' '}
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
          <Percent value={incomeRatio} />
          {' '}
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

const getRecapForObject = obj =>
  Object.keys(obj).map(key => ({
    label: `Recap.${key}`,
    value: toMoney(obj[key]),
    hide: !obj[key],
  }));

export const getNotaryFeesArray = ({ loan, structureId }) => {
  const propAndWork = Calculator.getPropAndWork({ loan, structureId });
  const propertyValue = Calculator.selectPropertyValue({ loan, structureId });
  const mortgageNoteIncrease = Calculator.getMortgageNoteIncrease({
    loan,
    structureId,
  });
  const calc = Calculator.getFeesCalculator({ loan, structureId });
  const {
    total,
    estimate,
    buyersContractFees: {
      additionalFees: buyersContractAdditionalFees,
      total: buyersContractFees,
      ...buyersContractValues
    } = {},
    mortgageNoteFees: {
      additionalFees: mortgageNoteAdditionalFees,
      total: mortgageNoteFees,
      ...mortgageNoteValues
    } = {},
    deductions: { buyersContractDeductions, mortgageNoteDeductions } = {},
  } = calc.getNotaryFeesForLoan({ loan, structureId });

  if (estimate) {
    return [
      {
        label: 'Recap.estimatedFees',
        value: toMoney(total),
      },
    ];
  }

  return [
    {
      title: true,
      label: 'Recap.buyersContract',
      intlValues: { value: toMoney(propertyValue) },
    },
    ...getRecapForObject(buyersContractValues),
    {
      label: 'Recap.propertyRegistrationTaxDeductions',
      value: `-${toMoney(buyersContractDeductions)}`,
      hide: !buyersContractDeductions,
    },
    {
      label: 'Recap.buyersContractAdditionalFees',
      value: `~${toMoney(buyersContractAdditionalFees)}`,
      hide: !buyersContractAdditionalFees,
    },
    {
      key: 'subtotal1',
      label: 'Recap.subTotal',
      value: (
        <span className="sum">
          {toMoney(buyersContractFees - buyersContractDeductions)}
        </span>
      ),
      spacingTop: true,
      spacing: true,
    },
    {
      title: true,
      label: 'Recap.mortgageNote',
      intlValues: { value: toMoney(mortgageNoteIncrease) },
    },
    ...getRecapForObject(mortgageNoteValues),
    {
      label: 'Recap.mortgageNoteRegistrationTaxDeductions',
      value: `-${toMoney(mortgageNoteDeductions)}`,
      hide: !mortgageNoteDeductions,
    },
    {
      label: 'Recap.mortgageNoteAdditionalFees',
      value: `~${toMoney(mortgageNoteAdditionalFees)}`,
      hide: !mortgageNoteAdditionalFees,
    },
    {
      key: 'subtotal2',
      label: 'Recap.subTotal',
      value: (
        <span className="sum">
          {toMoney(mortgageNoteFees - mortgageNoteDeductions)}
        </span>
      ),
      spacingTop: true,
      spacing: true,
    },
    {
      label: 'Recap.total',
      value: <span className="sum">{toMoney(total)}</span>,
      spacingTop: true,
      bold: true,
    },
    {
      label: 'Recap.notaryFeesRatio',
      value: `${((total / propAndWork) * 100).toFixed(2)}%`,
      spacingTop: true,
    },
  ];
};

export const getPremiumArray = ({ Calculator: calc = Calculator, loan }) => {
  const borrowRatio = calc.getBorrowRatio({ loan });
  const loanValue = calc.selectLoanValue({ loan });
  const maxBorrowRatio = calc.getMaxBorrowRatio({ loan });
  const notaryFees = calc.getFees({ loan }).total;
  const ownFundsNonPledged = calc.getNonPledgedOwnFunds({ loan });
  const project = calc.getProjectValue({ loan });
  const propAndWork = calc.getPropAndWork({ loan });
  const propertyValue = calc.selectPropertyValue({ loan });
  const propertyWork = calc.selectStructureKey({
    loan,
    key: 'propertyWork',
  });
  const totalFinancing = calc.getTotalFinancing({ loan });

  return [
    {
      title: true,
      label: (
        <span>
          <T id="Recap.title" />
          &nbsp;
          {Meteor.microservice === 'admin' && calc.organisationName && (
            <span className="secondary">
              (
              <T
                id="Recap.consideredBy"
                values={{ organisationName: calc.organisationName }}
              />
              )
            </span>
          )}
        </span>
      ),
      props: { style: { marginTop: 0 } },
      noIntl: true,
    },
    {
      label: "Valeur de l'objet",
      value: toMoney(Math.round(propertyValue)),
      noIntl: true,
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
      label: 'Frais',
      value: toMoney(Math.round(notaryFees)),
      noIntl: true,
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
      label: 'Autres fonds',
      value: toMoney(ownFundsNonPledged),
      noIntl: true,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loanValue),
    },
    {
      label: 'Recap.totalFinancing',
      value: <span className="sum">{toMoney(totalFinancing)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
    },
    {
      label: propertyWork ? 'Recap.borrowRatio2' : 'Recap.borrowRatio1',
      value: (
        <span className="flex center">
          <PercentWithStatus
            value={borrowRatio}
            status={borrowRatio > maxBorrowRatio ? ERROR : SUCCESS}
          />
        </span>
      ),
    },
  ];
};
