/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';
import { REAL_ESTATE_INCOME_ALGORITHMS } from 'core/config/financeConstants';
import Calculator, {
  Calculator as CalculatorClass,
} from 'core/utils/Calculator';

import {
  cleanup,
  render,
  within,
} from '../../../../../utils/testHelpers/testing-library';
import IncomeAndExpenses from '../../pages/StructureAppendixPdfPage/IncomeAndExpenses';

describe('IncomeAndExpenses', () => {
  beforeEach(() => cleanup());

  it('renders rows and 2 columns', () => {
    const loan = { borrowers: [{}], structures: [{ id: 'struct' }] };
    const calculator = Calculator;
    const { getAllByRole } = render(
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
    const { getAllByRole } = render(
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

    expect(totalRow.querySelector('.left-value').textContent).to.equal(
      '60 000',
    );
    expect(totalRow.querySelector('.right-value').textContent).to.equal(
      '180 000',
    );
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
    const { getByText, getAllByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    expect(
      getByText('Intérêts théoriques')
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('40 000');
    expect(
      getByText('Amortissement théorique')
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('10 000');
    expect(
      getByText('Entretien théorique')
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('10 000');

    expect(
      getAllByText('Total')[0].closest('tr').querySelector('.left-value')
        .textContent,
    ).to.equal('60 000');
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
    const { getByText, getAllByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    expect(
      getByText('Revenus bruts annuels (hors bonus)')
        .closest('tr')
        .querySelector('.right-value').textContent,
    ).to.equal('180 000');

    expect(
      getAllByText('Total')[1].closest('tr').querySelector('.right-value')
        .textContent,
    ).to.equal('180 000');
  });

  it('renders income rows with realEstate', () => {
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
    const { getByText, getAllByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    expect(
      getByText('Revenus bruts annuels (hors bonus)')
        .closest('tr')
        .querySelector('.right-value').textContent,
    ).to.equal('180 000');

    expect(
      getByText('Revenus de fortune immobilière')
        .closest('tr')
        .querySelector('.right-value').textContent,
    ).to.equal('10 000');

    expect(
      getByText('Charges théoriques immobilières')
        .closest('tr')
        .querySelector('.right-value').textContent,
    ).to.equal('-10 000');

    expect(
      getAllByText('Total')[1].closest('tr').querySelector('.right-value')
        .textContent,
    ).to.equal('180 000');

    // Only to verify that no extra expenses are added
    expect(
      getAllByText('Total')[0].closest('tr').querySelector('.left-value')
        .textContent,
    ).to.equal('60 000');
  });

  it('renders income rows with realEstate rows using deltas', () => {
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

    const { getByText, getAllByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    expect(
      getByText('Revenus bruts annuels (hors bonus)')
        .closest('tr')
        .querySelector('.right-value').textContent,
    ).to.equal('180 000');

    expect(
      getByText('Delta immobilier positif')
        .closest('tr')
        .querySelector('.right-value').textContent,
    ).to.equal('1 000');

    expect(
      getAllByText('Total')[1].closest('tr').querySelector('.right-value')
        .textContent,
    ).to.equal('181 000');
  });

  it('renders expenses rows with realEstate rows using deltas', () => {
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

    const { getByText, getAllByText } = render(
      <IncomeAndExpenses
        loan={loan}
        structureId="struct"
        calculator={calculator}
      />,
    );

    expect(
      getAllByText('Delta immobilier négatif', { exact: false })[0]
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('60 000');

    expect(
      getByText('Intérêts théoriques')
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('40 000');

    expect(
      getByText('Amortissement théorique')
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('10 000');

    expect(
      getByText('Entretien théorique')
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('10 000');

    expect(
      getAllByText('Delta immobilier négatif', { exact: false })[1]
        .closest('tr')
        .querySelector('.left-value').textContent,
    ).to.equal('1 000');

    expect(
      getAllByText('Total')[0].closest('tr').querySelector('.left-value')
        .textContent,
    ).to.equal('61 000');
  });
});
