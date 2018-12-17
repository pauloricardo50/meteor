import React from 'react';
import Calculator from '../../utils/Calculator';
import { T, Percent, MetricArea } from '../Translation';
import { toMoney } from '../../utils/conversionFunctions';

export const getDashboardArray = (props) => {
  const bonusIncome = Calculator.getBonusIncome(props);
  const borrowerIncome = Calculator.getTotalIncome(props);
  const borrowRatio = Calculator.getBorrowRatio(props);
  const expenses = Calculator.getExpenses(props);
  const fortune = Calculator.getFortune(props);
  const ownFundsNonPledged = Calculator.getNonPledgedOwnFunds(props);
  const ownFundsPledged = Calculator.getTotalPledged(props);
  const incomeRatio = Calculator.getIncomeRatio(props);
  const insuranceFortune = Calculator.getInsuranceFortune(props);
  const loanValue = Calculator.selectLoanValue(props);
  const maxBorrowRatio = Calculator.getMaxBorrowRatio(props);
  const monthly = Calculator.getMonthly(props);
  const notaryFees = Calculator.getFees(props).total;
  const otherIncome = Calculator.getOtherIncome(props);
  const project = Calculator.getProjectValue(props);
  const propAndWork = Calculator.getPropAndWork(props);
  const propertyValue = Calculator.selectPropertyValue(props);
  const propertyWork = Calculator.makeSelectStructureKey('propertyWork')(props);
  const realEstateDebt = Calculator.getRealEstateDebt(props);
  const realEstateFortune = Calculator.getRealEstateFortune(props);
  const realEstateValue = Calculator.getRealEstateValue(props);
  const totalFunds = Calculator.getTotalFunds(props);
  const totalFinancing = Calculator.getTotalFinancing(props);

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
          <Percent value={borrowRatio} />{' '}
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
          <Percent value={incomeRatio} />{' '}
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

export const getBorrowerArray = ({ borrower: borrowers }) => {
  const expenses = Calculator.getExpenses({ borrowers });
  const bonusIncome = Calculator.getBonusIncome({ borrowers });
  const otherIncome = Calculator.getOtherIncome({ borrowers });
  const otherFortune = Calculator.getOtherFortune({ borrowers });
  const realEstateFortune = Calculator.getRealEstateFortune({
    borrowers,
  });
  const realEstateValue = Calculator.getRealEstateValue({
    borrowers,
  });
  const realEstateDebt = Calculator.getRealEstateDebt({ borrowers });
  const fortune = Calculator.getFortune({ borrowers });
  const thirdPartyFortune = Calculator.getThirdPartyFortune({ borrowers });
  const insuranceFortune = Calculator.getInsuranceFortune({
    borrowers,
  });
  const totalFunds = Calculator.getTotalFunds({ borrowers });
  const salary = Calculator.getSalary({ borrowers });
  const income = Calculator.getTotalIncome({ borrowers });

  const netFortune = totalFunds + realEstateFortune + otherFortune;

  return [
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
      label: 'Recap.thirdPartyFortune',
      value: toMoney(thirdPartyFortune),
      hide: !thirdPartyFortune,
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
          <Percent value={borrowRatio} />{' '}
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
          <Percent value={incomeRatio} />{' '}
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

export const getNotaryFeesArray = ({ loan, structureId }) => {
  const calc = Calculator.getFeesCalculator({ loan, structureId });
  const {
    total,
    buyersContractFees: {
      propertyRegistrationTax,
      landRegistryPropertyTax,
      notaryIncomeFromProperty,
      additionalFees: buyersContractAdditionalFees,
      total: buyersContractFees,
    },
    mortgageNoteFees: {
      mortgageNoteRegistrationTax,
      landRegistryMortgageNoteTax,
      notaryIncomeFromMortgageNote,
      additionalFees: mortgageNoteAdditionalFees,
      total: mortgageNoteFees,
    },
    deductions: { buyersContractDeductions, mortgageNoteDeductions },
  } = calc.getNotaryFeesForLoan({
    loan,
    structureId,
  });

  return [
    {
      title: true,
      label: 'Recap.buyersContract',
    },
    {
      label: 'Recap.propertyRegistrationTax',
      value: toMoney(propertyRegistrationTax),
    },
    {
      label: 'Recap.propertyRegistrationTaxDeductions',
      value: `-${toMoney(buyersContractDeductions)}`,
      hide: !buyersContractDeductions,
    },
    {
      label: 'Recap.landRegistryPropertyTax',
      value: toMoney(landRegistryPropertyTax),
    },
    {
      label: 'Recap.notaryIncomeFromPropertyWithVAT',
      value: toMoney(notaryIncomeFromProperty),
    },
    {
      label: 'Recap.buyersContractAdditionalFees',
      value: `~${toMoney(buyersContractAdditionalFees)}`,
      hide: !buyersContractAdditionalFees,
    },
    {
      key: 'subtotal1',
      label: 'Recap.subTotal',
      value: <span className="sum">{toMoney(buyersContractFees - buyersContractDeductions)}</span>,
      spacingTop: true,
      spacing: true,
    },
    {
      title: true,
      label: 'Recap.mortgageNote',
    },
    {
      label: 'Recap.mortgageNoteRegistrationTax',
      value: toMoney(mortgageNoteRegistrationTax),
      hide: !mortgageNoteRegistrationTax,
    },
    {
      label: 'Recap.mortgageNoteRegistrationTaxDeductions',
      value: `-${toMoney(mortgageNoteDeductions)}`,
      hide: !mortgageNoteDeductions,
    },
    {
      label: 'Recap.landRegistryMortgageNoteTax',
      value: toMoney(landRegistryMortgageNoteTax),
      hide: !landRegistryMortgageNoteTax,
    },
    {
      label: 'Recap.notaryIncomeFromMortgageNoteWithVAT',
      value: toMoney(notaryIncomeFromMortgageNote),
    },
    {
      label: 'Recap.mortgageNoteAdditionalFees',
      value: `~${toMoney(mortgageNoteAdditionalFees)}`,
      hide: !mortgageNoteAdditionalFees,
    },
    {
      key: 'subtotal2',
      label: 'Recap.subTotal',
      value: <span className="sum">{toMoney(mortgageNoteFees - mortgageNoteDeductions)}</span>,
      spacingTop: true,
    },
    {
      label: 'Recap.total',
      value: <span className="sum">{toMoney(total)}</span>,
      spacingTop: true,
      bold: true,
    },
  ];
};
