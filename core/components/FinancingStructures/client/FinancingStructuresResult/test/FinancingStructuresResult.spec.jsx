// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider, intlShape } from 'react-intl';
import { ScrollSync } from 'react-scroll-sync';
import messages from 'core/lang/fr.json';

import FinancingStructuresResult from '../FinancingStructuresResult';

const mockStore = configureStore();

describe('FinancingStructuresResult', () => {
  let props;
  let store;
  const { intl } = new IntlProvider({
    defaultLocale: 'fr',
    messages,
  }).getChildContext();
  const component = () =>
    mount(
      <ScrollSync>
        <Provider store={mockStore(store)}>
          <FinancingStructuresResult {...props} />
        </Provider>
      </ScrollSync>,
      {
        context: { intl },
        childContextTypes: { intl: intlShape },
      },
    );

  beforeEach(() => {
    props = {};
    store = {
      financingStructures: {
        loan: {},
        structures: [],
        borrowers: [],
        properties: [],
      },
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
        fortuneUsed: 250000,
        secondPillarPledged: 0,
        thirdPillarPledged: 0,
        secondPillarWithdrawal: 0,
        thirdPillarWithdrawal: 0,
        thirdPartyFortuneUsed: 0,
      };
      store = {
        financingStructures: {
          loan: { selectedStructure: 'a', structure },
          structures: {
            a: structure,
          },
          borrowers: {
            john: {
              _id: 'john',
              bankFortune: 250000,
              salary: 200000,
              insuranceSecondPillar: 50,
              insuranceThirdPillar: 60,
            },
          },
          properties: {
            house: { _id: 'house', value: 1000000, monthlyExpenses: 100 },
          },
        },
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
      expect(incomeRatio.contains('0,29') || incomeRatio.contains('0.29')).to.equal(true);
    });

    it('remainingCash', () => {
      const remainingCash = component()
        .find('.remainingCash')
        .last();

      expect(remainingCash.contains('0')).to.equal(true);
    });

    it('remainingSecondPillar', () => {
      const remainingSecondPillar = component()
        .find('.remainingSecondPillar')
        .last();

      expect(remainingSecondPillar.contains('50')).to.equal(true);
    });

    it('remainingThirdPillar', () => {
      const remainingThirdPillar = component()
        .find('.remainingThirdPillar')
        .last();

      expect(remainingThirdPillar.contains('60')).to.equal(true);
    });
  });

  it.skip('renders an error if an interest rate is not defined', () => {
    // FIXME: Enzyme does not support componentDidCatch yet
    // https://github.com/airbnb/enzyme/issues/1553
    store = {
      financingStructures: {
        loan: {},
        structures: {
          a: {
            id: 'a',
            loanTranches: [{ type: 'unknown_rate' }],
          },
        },
        borrowers: {},
        properties: {},
      },
    };
    expect(component()
      .find('.error')
      .exists()).to.equal(true);
  });
});
