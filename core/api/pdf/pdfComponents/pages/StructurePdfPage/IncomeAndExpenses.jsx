// @flow
import React from 'react';

import T, { Money } from '../../../../../components/Translation';
import BalanceSheetTable from '../../BalanceSheetTable';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { shouldRenderRow } from '../../PdfTable/PdfTable';

type IncomeAndExpensesProps = {};

const getIncomeRows = ({ loan, structureId, calculator }) => {
  const salary = calculator.getSalary({ loan, structureId });
  const bonus = calculator.getBonusIncome({ loan, structureId });
  const otherIncome = calculator.getOtherIncome({ loan, structureId });
  const fortuneReturns = calculator.getFortuneReturns({ loan, structureId });
  const realEstateIncome = calculator.getRealEstateIncome({
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
    asObject: true,
  });
  const expenses = calculator.getGroupedExpensesBySide({
    loan,
    toSubtractFromIncome: false,
  });

  return [
    {
      label: <i>Taux d'intérêt théorique</i>,
      value: <i>{toMoney(propertyCost.interests * 12)}</i>,
      money: false,
    },
    {
      label: <i>Amortissement théorique</i>,
      value: <i>{toMoney(propertyCost.amortization * 12)}</i>,
      money: false,
    },
    {
      label: <i>Frais d'entretien théorique</i>,
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

const IncomeAndExpenses = ({
  loan,
  structureId,
  calculator,
}: IncomeAndExpensesProps) => (
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
