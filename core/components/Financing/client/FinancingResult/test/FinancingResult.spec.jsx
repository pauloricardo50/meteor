// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';
import { IntlProvider, intlShape } from 'react-intl';
import { ScrollSync } from 'react-scroll-sync';
import messages from 'core/lang/fr.json';

import FinancingResult from '../FinancingResult';
import { Provider } from '../../containers/loan-context';

describe('FinancingResult', () => {
  let props;
  let loan;
  const { intl } = new IntlProvider({
    defaultLocale: 'fr',
    messages,
  }).getChildContext();
  const component = () =>
    mount(
      <ScrollSync>
        <Provider value={loan}>
          <FinancingResult {...props} />
        </Provider>
      </ScrollSync>,
      {
        context: { intl },
        childContextTypes: { intl: intlShape },
      },
    );

  beforeEach(() => {
    props = {};
    loan = {
      structures: [],
      borrowers: [],
      properties: [],
    };
  });

  context('renders the correct results for a standard structure', () => {
    beforeEach(() => {
      const structure = {
        id: 'a',
        loanTranches: [{ type: 'interest10', value: 1 }],
        propertyId: 'house',
        propertyWork: 0,
        wantedLoan: 800000,
        ownFunds: [{ type: 'bankFortune', value: 250000 }],
      };
      loan = {
        selectedStructure: 'a',
        structure,
        structures: [structure],
        borrowers: [
          {
            _id: 'john',
            bankFortune: 250000,
            salary: 200000,
            insurance2: [{ value: 50 }],
            insurance3A: [{ value: 60 }],
          },
        ],
        properties: [
          {
            _id: 'house',
            value: 1000000,
            monthlyExpenses: 100,
          },
        ],
      };
    });

    it('monthly', () => {
      const monthly = component().find('.financing-structures-result-chart .total');
      const string = monthly.text();
      const hasNonZeroNumber = /[1-9]/.test(string);
      // Interests rates change constantly, can't pin a precise value
      expect(hasNonZeroNumber).to.equal(true);
    });

    it('interestsCost', () => {
      const interestsCost = component()
        .find('.interestsCost')
        .last();
      const string = interestsCost.text();
      const hasNonZeroNumber = /[1-9]/.test(string);

      expect(hasNonZeroNumber).to.equal(true);
    });

    it('amortizationCost', () => {
      const amortizationCost = component()
        .find('.amortizationCost')
        .last();

      expect(amortizationCost.contains('833')).to.equal(true);
    });

    it('propertyCost', () => {
      const propertyCost = component()
        .find('.propertyCost')
        .last();

      expect(propertyCost.contains('100')).to.equal(true);
    });

    it('borrowRatio', () => {
      const borrowRatio = component()
        .find('.borrowRatio')
        .last();

      // Do this because of different browsers..
      expect(borrowRatio.contains('0,8') || borrowRatio.contains('0.8')).to.equal(true);
    });

    it('incomeRatio', () => {
      const incomeRatio = component()
        .find('.incomeRatio')
        .last();

      // Do this because of different browsers..
      expect(incomeRatio.contains('0,3') || incomeRatio.contains('0.3')).to.equal(true);
    });

    it('remainingCash', () => {
      const remainingCash = component()
        .find('.remainingCash')
        .last();

      expect(remainingCash.contains('0')).to.equal(true);
    });

    it('remainingInsurance2', () => {
      const remainingInsurance2 = component()
        .find('.remainingInsurance2')
        .last();

      expect(remainingInsurance2.contains('50')).to.equal(true);
    });

    it('remainingInsurance3A', () => {
      const remainingInsurance3A = component()
        .find('.remainingInsurance3A')
        .last();

      expect(remainingInsurance3A.contains('60')).to.equal(true);
    });
  });

  it.skip('renders an error if an interest rate is not defined', () => {
    // FIXME: Enzyme does not support componentDidCatch yet
    // https://github.com/airbnb/enzyme/issues/1553
    loan = {
      structures: [
        {
          id: 'a',
          loanTranches: [{ type: 'unknown_rate' }],
        },
      ],
      borrowers: [{}],
      properties: [{}],
    };
    expect(component()
      .find('.error')
      .exists()).to.equal(true);
  });
});
