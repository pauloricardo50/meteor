// @flow
import React from 'react';

import T, { Money } from '../../../../../components/Translation';
import BalanceSheetTable from '../../BalanceSheetTable';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { shouldRenderRow } from '../../PdfTable/PdfTable';

type IncomeAndExpensesProps = {};

const getIncomeRows = ({ loan, structureId, calculator }) => {
  const salary = calculator.getSalary({ loan });
  const bonus = calculator.getBonusIncome({ loan });
  const otherIncome = calculator.getOtherIncome({ loan });
  const fortuneReturns = calculator.getFortuneReturns({ loan });
  const realEstateIncome = calculator.getRealEstateIncome({ loan });
  const expenses = calculator.getGroupedExpensesBySide({
    loan,
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
    ...Object.keys(expenses).map(expenseType => ({
      label: <T id={`Forms.expenses.${expenseType}`} />,
      value: <span>-{toMoney(expenses[expenseType])}</span>,
      condition: !!expenses[expenseType],
      money: false,
    })),
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const getExpenseRows = ({ loan, structureId, calculator }) => {
  const propertyCost = calculator.getTheoreticalPropertyCost({
    loan,
    structureId,
  }) * 12;
  const expenses = calculator.getGroupedExpensesBySide({
    loan,
    toSubtractFromIncome: false,
  });

  return [
    { label: 'Charges théoriques', value: propertyCost },
    ...Object.keys(expenses).map(expenseType => ({
      label: <T id={`Forms.expenses.${expenseType}`} />,
      value: expenses[expenseType],
      condition: !!expenses[expenseType],
    })),
  ].filter(({ condition }) => shouldRenderRow(condition));
};

const IncomeAndExpenses = ({
  loan,
  structureId,
  calculator,
}: IncomeAndExpensesProps) => (
  <BalanceSheetTable
    titles={['Charges', 'Revenus']}
    rightRows={getExpenseRows({ loan, structureId, calculator })}
    leftRows={getIncomeRows({ loan, structureId, calculator })}
    bottomTitles={['Total', 'Total']}
    bottomValues={[
      <Money
        currency={false}
        value={calculator.getTheoreticalMonthly({ loan }) * 12}
        key="0"
      />,
      <Money
        currency={false}
        value={calculator.getTotalIncome({ loan })}
        key="1"
      />,
    ]}
  />
);

export default IncomeAndExpenses;
