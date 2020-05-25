/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { REAL_ESTATE_INCOME_ALGORITHMS } from 'imports/core/config/financeConstants';

import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';
import Calculator, {
  Calculator as CalculatorClass,
} from 'core/utils/Calculator';

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../../../utils/testHelpers/testing-library';
import IncomeAndExpenses from '../../pages/StructureAppendixPdfPage/IncomeAndExpenses';

describe.only('IncomeAndExpenses', () => {
  beforeEach(() => cleanup());

  it('renders rows and 2 columns', () => {
    const loan = { borrowers: [{}], structures: [{ id: 'struct' }] };
    const calculator = Calculator;
    const { getAllByRole, getByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    const rows = getAllByRole('row');
    const [headerRow] = rows;

    const headerCells = within(headerRow).getAllByRole('cell');
    expect(headerCells.length).to.equal(2);

    expect(!!within(headerRow).getByText('Charges')).to.equal(true);
    expect(!!within(headerRow).getByText('Revenus')).to.equal(true);
  });

  it('renders total row', () => {
    const loan = {
      borrowers: [{ salary: 180000 }],
      structures: [
        {
          id: 'struct',
          wantedLoan: 800000,
          propertyValue: 1000000,
          loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
        },
      ],

      interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
    };
    const calculator = Calculator;
    const { getAllByRole, getAllByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    const rows = getAllByRole('row');
    const [totalRow] = rows.reverse();

    const totalCells = within(totalRow).getAllByRole('cell');
    expect(totalCells.length).to.equal(4);

    expect(within(totalRow).getAllByText('Total').length).to.equal(2);
    const [
      totalExpenses,
      totalExpensesValue,
      totalIncome,
      totalIncomeValue,
    ] = totalCells;
    expect(totalExpensesValue.textContent).to.include('60 000');
    expect(totalIncomeValue.textContent).to.include('180 000');
  });

  it('renders expenses rows', () => {
    const loan = {
      borrowers: [{ salary: 180000 }],
      structures: [
        {
          id: 'struct',
          wantedLoan: 800000,
          propertyValue: 1000000,
          loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
        },
      ],

      interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
    };
    const calculator = Calculator;
    const { getAllByRole } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    const rows = getAllByRole('row');
    const expensesRows = rows.slice(1, -1).map(row =>
      within(row)
        .getAllByRole('cell')
        .slice(0, 2),
    );
    // Filter empty lines
    const filteredExpensesRows = expensesRows.filter(r => !!r[0].textContent);
    expect(filteredExpensesRows.length).to.equal(3);

    const [
      [interestsLabel, interests],
      [amortizationLabel, amortization],
      [maintenanceLabel, maintenance],
    ] = filteredExpensesRows;

    expect(interestsLabel.textContent).to.include('Intérêts théoriques');
    expect(interests.textContent).to.include('40 000');

    expect(amortizationLabel.textContent).to.include('Amortissement théorique');
    expect(amortization.textContent).to.include('10 000');

    expect(maintenanceLabel.textContent).to.include('Entretien théorique');
    expect(maintenance.textContent).to.include('10 000');
  });

  it('renders income rows', () => {
    const loan = {
      borrowers: [{ salary: 180000 }],
      structures: [
        {
          id: 'struct',
          wantedLoan: 800000,
          propertyValue: 1000000,
          loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
        },
      ],

      interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
    };
    const calculator = Calculator;
    const { getAllByRole } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    const rows = getAllByRole('row');
    const incomeRows = rows.slice(1, -1).map(row =>
      within(row)
        .getAllByRole('cell')
        .slice(2),
    );

    // Filter empty lines
    const filteredIncomeRows = incomeRows.filter(r => !!r[0].textContent);
    expect(filteredIncomeRows.length).to.equal(1);

    const [[salaryLabel, salary]] = filteredIncomeRows;

    expect(salaryLabel.textContent).to.include('Revenus bruts annuels');
    expect(salary.textContent).to.include('180 000');
  });

  it('renders realEstate rows', () => {
    const loan = {
      borrowers: [
        {
          salary: 180000,
          realEstate: [
            {
              value: 1000000,
              loan: 800000,
              income: 4000,
              theoreticalExpenses: 5000,
            },
            {
              value: 1000000,
              loan: 800000,
              income: 6000,
              theoreticalExpenses: 5000,
            },
          ],
        },
      ],
      structures: [
        {
          id: 'struct',
          wantedLoan: 800000,
          propertyValue: 1000000,
          loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
        },
      ],

      interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
    };

    const calculator = Calculator;
    const { getAllByRole } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    const rows = getAllByRole('row');
    const incomeRows = rows.slice(1).map(row =>
      within(row)
        .getAllByRole('cell')
        .slice(2),
    );
    const expensesRows = rows.slice(1).map(row =>
      within(row)
        .getAllByRole('cell')
        .slice(0, 2),
    );

    // Filter empty lines
    const filteredIncomeRows = incomeRows.filter(r => !!r[0].textContent);
    const filteredExpenses = expensesRows.filter(r => !!r[0].textContent);
    expect(filteredIncomeRows.length).to.equal(4);
    expect(filteredExpenses.length).to.equal(4);

    const [
      [salaryLabel, salary],
      [realEstate1Label, realEstate1],
      [realEstate2Label, realEstate2],
      totalIncomeRow,
    ] = filteredIncomeRows;
    const [totalIncome] = totalIncomeRow.reverse();

    expect(salaryLabel.textContent).to.include('Revenus bruts annuels');
    expect(salary.textContent).to.include('180 000');

    expect(realEstate1Label.textContent).to.include(
      'Revenus de fortune immobilière',
    );
    expect(realEstate1.textContent).to.include('10 000');

    expect(realEstate2Label.textContent).to.include(
      'Charges théoriques immobilières',
    );
    expect(realEstate2.textContent).to.include('-10 000');

    expect(totalIncome.textContent).to.include('180 000');

    const [totalExpensesRow] = filteredExpenses.reverse();
    const [totalExpenses] = totalExpensesRow.reverse();

    // Only to verify that no extra expenses are added
    expect(totalExpenses.textContent).to.include('60 000');
  });

  it('renders realEstate rows using deltas', () => {
    const loan = {
      borrowers: [
        {
          salary: 180000,
          realEstate: [
            {
              value: 1000000,
              loan: 800000,
              income: 4000,
              theoreticalExpenses: 5000,
            },
            {
              value: 1000000,
              loan: 800000,
              income: 6000,
              theoreticalExpenses: 5000,
            },
          ],
        },
      ],
      structures: [
        {
          id: 'struct',
          wantedLoan: 800000,
          propertyValue: 1000000,
          loanTranches: [{ type: INTEREST_RATES.YEARS_10, value: 800000 }],
        },
      ],

      interestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
    };

    const calculator = new CalculatorClass({
      realEstateIncomeAlgorithm:
        REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
    });

    const { getAllByRole } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    const rows = getAllByRole('row');
    const incomeRows = rows.slice(1).map(row =>
      within(row)
        .getAllByRole('cell')
        .slice(2),
    );
    const expensesRows = rows.slice(1).map(row =>
      within(row)
        .getAllByRole('cell')
        .slice(0, 2),
    );

    // Filter empty lines
    const filteredIncomeRows = incomeRows.filter(r => !!r[0].textContent);
    const filteredExpenses = expensesRows.filter(r => !!r[0].textContent);
    expect(filteredIncomeRows.length).to.equal(3);
    expect(filteredExpenses.length).to.equal(6);

    const [salaryRow, positiveDeltaRow, totalRow] = filteredIncomeRows;
    const [salaryLabel, salary] = salaryRow;
    const [positiveDeltaLabel, positiveDelta] = positiveDeltaRow;
    const [total] = totalRow.reverse();

    expect(salaryLabel.textContent).to.include('Revenus bruts annuels');
    expect(salary.textContent).to.include('180 000');

    expect(positiveDeltaLabel.textContent).to.include(
      'Delta immobilier positif',
    );
    expect(positiveDelta.textContent).to.include('1 000');

    expect(total.textContent).to.include('181 000');

    const [
      [currentNegativeDeltaLabel, currentNegativeDelta],
      [interestsLabel, interests],
      [amortizationLabel, amortization],
      [maintenanceLabel, maintenance],
      [negativeDeltaLabel, negativeDelta],
      totalExpensesRow,
    ] = filteredExpenses;
    const [totalExpenses] = totalExpensesRow.reverse();

    expect(currentNegativeDeltaLabel.textContent).to.include(
      'Delta immobilier négatif',
    );
    expect(currentNegativeDelta.textContent).to.include('60 000');
    expect(interestsLabel.textContent).to.include('Intérêts théoriques');
    expect(interests.textContent).to.include('40 000');
    expect(amortizationLabel.textContent).to.include('Amortissement théorique');
    expect(amortization.textContent).to.include('10 000');
    expect(maintenanceLabel.textContent).to.include('Entretien théorique');
    expect(maintenance.textContent).to.include('10 000');
    expect(negativeDeltaLabel.textContent).to.include(
      'Delta immobilier négatif',
    );
    expect(negativeDelta.textContent).to.include('1 000');
    expect(totalExpenses.textContent).to.include('61 000');
  });
});
