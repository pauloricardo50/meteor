import React from 'react';

import T, { Money } from '../../../../../components/Translation';
import Percent from '../../../../../components/Translation/numberComponents/Percent';
import { REAL_ESTATE_INCOME_ALGORITHMS } from '../../../../../config/financeConstants';
import { toMoney } from '../../../../../utils/conversionFunctions';
import { EXPENSE_TYPES } from '../../../../lenderRules/lenderRulesConstants';
import BalanceSheetTable from '../../BalanceSheetTable';
import { shouldRenderRow } from '../../PdfTable/PdfTable';

const formatExpensesToSubtractFromIncome = expenses =>
  Object.keys(expenses).map(expenseType => {
    const value = expenses[expenseType];
    return {
      label: getExpenseLabel(expenseType),
      // When an expense is positive, it means it has to be substracted from
      // the income
      // When it is negative, it has to be added to it
      value: -value,
      condition: !!value,
    };
  });

const renderRow = (partitioned = false) => income => {
  const { label, value, condition, secondary } = income;
  const arrayifiedLabel = Array.isArray(label) ? label : [label];
  const [mainLabel, secondaryLabel] = arrayifiedLabel;
  const shouldBeBold = partitioned && !secondary;

  const Component = shouldBeBold ? 'b' : React.Fragment;

  const formattedLabel = (
    <Component>
      {mainLabel}
      {secondaryLabel && (
        <span className="secondary" style={{ fontWeight: 'normal' }}>
          &nbsp;({secondaryLabel})
        </span>
      )}
    </Component>
  );

  const formattedValue = <Component>{toMoney(value)}</Component>;

  return {
    label: formattedLabel,
    value: formattedValue,
    money: false,
    condition,
  };
};

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
  const { addToIncome } = calculator.getTheoreticalPropertySplit({
    loan,
    structureId,
  });
  const propertyCost = calculator.getTheoreticalPropertyCost({
    loan,
    structureId,
    asObject: true,
  });
  const { theoreticalInterestRate, theoreticalMaintenanceRate } = calculator;
  const amortizationRate = calculator.getAmortizationRate({
    loan,
    structureId,
  });
  const isPositiveNegativeSplit =
    calculator.realEstateIncomeAlgorithm ===
    REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT;

  const propertyIncome = calculator.getYearlyPropertyIncome({
    loan,
    structureId,
  });

  const shouldDisplayDeltaSection = isPositiveNegativeSplit && !!addToIncome;

  const allIncomes = [
    {
      label: <T id={useNetSalary ? 'Forms.netSalary' : 'Forms.salary'} />,
      value: salary,
    },
    {
      label: [
        <T id="Forms.expenses.REAL_ESTATE_DELTA_POSITIVE" />,
        <T id="PDF.projectInfos.structure.currentProperty" />,
      ],
      value: 12 * addToIncome,
      condition: shouldDisplayDeltaSection,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.interests" />,
        <Percent value={theoreticalInterestRate} />,
      ],
      value: -propertyCost.interests * 12,
      condition: shouldDisplayDeltaSection,
      secondary: true,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.amortization" />,
        <Percent value={amortizationRate} />,
      ],
      value: -propertyCost.amortization * 12,
      condition: shouldDisplayDeltaSection,
      secondary: true,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.maintenance" />,
        <Percent value={theoreticalMaintenanceRate} />,
      ],
      value: -propertyCost.maintenance * 12,
      condition: shouldDisplayDeltaSection,
      secondary: true,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.yearlyPropertyIncome" />,
        !shouldDisplayDeltaSection && (
          <T id="PDF.projectInfos.structure.currentProperty" />
        ),
      ].filter(x => x),
      value: propertyIncome,
      condition: !!propertyIncome,
      secondary: true,
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
    // Expenses to subtract from income
    ...formatExpensesToSubtractFromIncome(expenses),
  ];

  return allIncomes
    .map(renderRow(shouldDisplayDeltaSection))
    .filter(({ condition }) => shouldRenderRow(condition));
};

const getExpenseLabel = expenseType => {
  if (
    [
      EXPENSE_TYPES.REAL_ESTATE_DELTA_POSITIVE,
      EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE,
    ].includes(expenseType)
  ) {
    return [
      <T id={`Forms.expenses.${expenseType}`} />,
      <T id="Forms.realEstate" />,
    ];
  }

  return <T id={`Forms.expenses.${expenseType}`} />;
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
  const { addToExpenses, addToIncome } = calculator.getTheoreticalPropertySplit(
    {
      loan,
      structureId,
    },
  );

  const isPositiveNegativeSplit =
    calculator.realEstateIncomeAlgorithm ===
    REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT;

  const propertyIncome = calculator.getYearlyPropertyIncome({
    loan,
    structureId,
  });
  const shouldDisplayDeltaSection = isPositiveNegativeSplit && !!addToExpenses;

  const allExpenses = [
    {
      label: [
        <T id="Forms.expenses.REAL_ESTATE_DELTA_NEGATIVE" />,
        <T id="PDF.projectInfos.structure.currentProperty" />,
      ],
      value: 12 * addToExpenses,
      condition: shouldDisplayDeltaSection,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.interests" />,
        <Percent value={theoreticalInterestRate} />,
      ],
      value: propertyCost.interests * 12,
      secondary: shouldDisplayDeltaSection,
      condition: isPositiveNegativeSplit ? !addToIncome : true,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.amortization" />,
        <Percent value={amortizationRate} />,
      ],
      value: propertyCost.amortization * 12,
      secondary: shouldDisplayDeltaSection,
      condition: isPositiveNegativeSplit ? !addToIncome : true,
    },
    {
      label: [
        <T id="PDF.projectInfos.structure.maintenance" />,
        <Percent value={theoreticalMaintenanceRate} />,
      ],
      value: propertyCost.maintenance * 12,
      secondary: shouldDisplayDeltaSection,
      condition: isPositiveNegativeSplit ? !addToIncome : true,
    },
    {
      label: <T id="PDF.projectInfos.structure.yearlyPropertyIncome" />,
      value: -propertyIncome,
      condition: shouldDisplayDeltaSection && !!propertyIncome,
      secondary: true,
    },
    ...Object.keys(expenses).map(expenseType => ({
      label: getExpenseLabel(expenseType),
      value: expenses[expenseType],
      condition: !!expenses[expenseType],
    })),
  ];

  return allExpenses
    .map(renderRow(shouldDisplayDeltaSection))
    .filter(({ condition }) => shouldRenderRow(condition));
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
        value={calculator.getMonthlyProjectCost({ loan, structureId }) * 12}
        key="0"
      />,
      <Money
        currency={false}
        value={calculator.getMonthlyProjectIncome({ loan, structureId }) * 12}
        key="1"
      />,
    ]}
  />
);

export default IncomeAndExpenses;
