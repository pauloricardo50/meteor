import React from 'react';

import Percent from 'core/components/Translation/numberComponents/Percent';
import T, { Money } from '../../../../../../components/Translation';
import { toMoney } from '../../../../../../utils/conversionFunctions';
import { shouldRenderRow } from '../../PdfTable/PdfTable';
import BalanceSheetTable from '../../BalanceSheetTable';

const renderExpenses = expenses =>
  Object.keys(expenses).map(expenseType => {
    const value = expenses[expenseType];
    return {
      label: <T id={`Forms.expenses.${expenseType}`} />,
      // When an expense is positive, it means it has to be substracted from
      // the income
      // When it is negative, it has to be added to it
      value:
        value < 0 ? (
          <span>{toMoney(value, { noPrefix: true })}</span>
        ) : (
          <span>-{toMoney(value)}</span>
        ),
      condition: !!value,
      money: false,
    };
  });

const getIncomeRows = ({ loan, structureId, calculator }) => {
  const salary = calculator.getSalary({ loan, structureId });
  const bonus = calculator.getBonusIncome({ loan, structureId });
  const otherIncome = calculator.getOtherIncome({ loan, structureId });
  const fortuneReturns = calculator.getFortuneReturns({ loan, structureId });
  const realEstateIncome = calculator.getRealEstateIncomeTotal({
    loan,
    structureId,
  });
  const expenses = calculator.getGroupedExpensesBySide({
    loan,
    structureId,
    toSubtractFromIncome: true,
  });

  const useNetSalary = calculator.shouldUseNetSalary();

  return [
    {
      label: <T id={useNetSalary ? 'Forms.netSalary' : 'Forms.salary'} />,
      value: salary,
    },
    {
      label: <T id="Recap.consideredBonus" />,
      value: bonus,
      condition: !!bonus,
    },
    {
      label: <T id="Forms.otherIncome" />,
      value: otherIncome,
      condition: !!otherIncome,
    },
    {
      label: <T id="Forms.fortuneReturns" />,
      value: fortuneReturns,
      condition: !!fortuneReturns,
    },
    {
      label: <T id="Forms.realEstateIncome" />,
      value: realEstateIncome,
      condition: !!realEstateIncome,
    },
    ...renderExpenses(expenses),
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const getExpenseRows = ({ loan, structureId, calculator }) => {
  const propertyCost = calculator.getTheoreticalPropertyCost({
    loan,
    structureId,
    asObject: true,
  });
  const expenses = calculator.getGroupedExpensesBySide({
    loan,
    toSubtractFromIncome: false,
  });
  const { theoreticalInterestRate, theoreticalMaintenanceRate } = calculator;
  const amortizationRate = calculator.getAmortizationRate({
    loan,
    structureId,
  });

  return [
    {
      label: (
        <i>
          Taux d'intérêt théorique (
          <Percent value={theoreticalInterestRate} />)
        </i>
      ),
      value: <i>{toMoney(propertyCost.interests * 12)}</i>,
      money: false,
    },
    {
      label: (
        <i>
          Amortissement théorique (
          <Percent value={amortizationRate} />)
        </i>
      ),
      value: <i>{toMoney(propertyCost.amortization * 12)}</i>,
      money: false,
    },
    {
      label: (
        <i>
          Frais d'entretien théorique (
          <Percent value={theoreticalMaintenanceRate} />)
        </i>
      ),
      value: <i>{toMoney(propertyCost.maintenance * 12)}</i>,
      money: false,
    },
    ...Object.keys(expenses).map(expenseType => ({
      label: <T id={`Forms.expenses.${expenseType}`} />,
      value: expenses[expenseType],
      condition: !!expenses[expenseType],
    })),
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const IncomeAndExpenses = ({ loan, structureId, calculator }) => (
  <BalanceSheetTable
    titles={['Charges', 'Revenus']}
    leftRows={getExpenseRows({ loan, structureId, calculator })}
    rightRows={getIncomeRows({ loan, structureId, calculator })}
    bottomTitles={['Total', 'Total']}
    bottomValues={[
      <Money
        currency={false}
        value={calculator.getTheoreticalMonthly({ loan, structureId }) * 12}
        key="0"
      />,
      <Money
        currency={false}
        value={calculator.getTotalIncome({ loan, structureId })}
        key="1"
      />,
    ]}
  />
);

export default IncomeAndExpenses;
