// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';
import { REAL_ESTATE_INCOME_ALGORITHMS } from 'core/config/financeConstants';
import Calculator, {
  Calculator as CalculatorClass,
} from 'core/utils/Calculator';
import BorrowersPdfPage from '../BorrowersPdfPage';

describe.only('BorrowersPdfPage', () => {
  let props;
  const component = () =>
    getMountedComponent({ Component: BorrowersPdfPage, props });
  const getRowValue = (table, at) =>
    component()
      .find(`${table} tr`)
      .at(at)
      .find('td')
      .last()
      .text();
  const getRowLabel = (table, at) =>
    component()
      .find(`${table} tr`)
      .at(at)
      .find('td')
      .first()
      .text();

  beforeEach(() => {
    getMountedComponent.reset();
    getMountedComponent.reset();
    props = {
      loan: { borrowers: [{ expenses: [] }] },
      calculator: Calculator,
    };
  });

  it('renders a title and 2 tables', () => {
    expect(component().find('h1').length).to.equal(1);
    expect(component().find('table').length).to.equal(2);
  });

  describe('Info table', () => {
    it('renders an info table with rows depending on content', () => {
      expect(component()
        .find('table')
        .at(0)
        .find('tr').length).to.equal(3);

      props.loan.borrowers = [
        { expenses: [], childrenCount: 2, company: 'e-Potek' },
      ];
      getMountedComponent.reset();
      expect(component()
        .find('table')
        .at(0)
        .find('tr').length).to.equal(5);
    });
  });

  describe('Finance table', () => {
    it('has 2 subsections', () => {
      expect(component()
        .find('table')
        .at(1)
        .find('.subsection-row').length).to.equal(2);
    });

    it('contains income of the borrowers', () => {
      props.loan.borrowers = [{ expenses: [], salary: 100000 }];
      expect(getRowValue('.finance', 2)).to.equal('100 000');

      props.loan.borrowers = [
        { expenses: [], salary: 100000 },
        { expenses: [], salary: 100000 },
      ];
      getMountedComponent.reset();
      expect(getRowValue('.finance', 2)).to.equal('200 000');
    });

    it('renders realEstate income', () => {
      props.loan.borrowers = [
        {
          expenses: [],
          salary: 100000,
          realEstate: [
            { value: 1200000, loan: 960000, income: 100000 },
            { value: 1200000, loan: 960000, income: 200000 },
          ],
        },
      ];
      expect(getRowValue('.finance', 3)).to.equal('300 000');
    });

    it('renders positive realEstate deltas', () => {
      // Negative deltas are only displayed in the expenses
      props.calculator = new CalculatorClass({
        realEstateIncomeAlgorithm:
          REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT,
      });
      props.loan.borrowers = [
        {
          expenses: [],
          salary: 100000,
          realEstate: [
            { value: 1200000, loan: 960000, income: 100000 },
            { value: 1200000, loan: 960000, income: 50000 },
          ],
        },
      ];
      expect(getRowLabel('.finance', 3)).to.equal('Delta immobilier positif');
      expect(getRowValue('.finance', 3)).to.equal('28 000');
      expect(getRowLabel('.finance', 4)).to.include('Total');
      expect(getRowValue('.finance', 4)).to.equal('128 000');
    });
  });
});
