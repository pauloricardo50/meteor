// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';
import { IntlProvider, intlShape } from 'react-intl';
import { ScrollSync } from 'react-scroll-sync';
import messages from 'core/lang/fr.json';

import { OWN_FUNDS_USAGE_TYPES } from 'imports/core/api/constants';
import FinancingResult from '../FinancingResult';
import { Provider } from '../../containers/loan-context';
import { INTEREST_RATES } from '../../../../../api/interestRates/interestRatesConstants';
import Calculator from '../../../../../utils/Calculator';

const expectResult = (component, name, value) => {
  const val = component()
    .find(name)
    .last();
  console.log('val:', val.debug());

  if (!Number.isInteger(value)) {
    // On our test browsers, the comma is represented either as a , or .
    // due to the web's "intl" API
    expect(val.contains(`${value}`) || val.contains(`${value}`.replace('.', ','))).to.equal(true);
  } else {
    expect(val.contains(`${value}`)).to.equal(true);
  }
};

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
        <Provider value={{ loan, Calculator }}>
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
            yearlyExpenses: 1200,
          },
        ],
        currentInterestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
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
      expectResult(component, '.amortizationCost', 833);
    });

    it('propertyCost', () => {
      expectResult(component, '.propertyCost', 100);
    });

    it('borrowRatio', () => {
      expectResult(component, '.borrowRatio', 0.8);
    });

    it('incomeRatio', () => {
      expectResult(component, '.incomeRatio', 0.3);
    });

    it('remainingCash', () => {
      expectResult(component, '.remainingCash', 0);
    });

    it('remainingInsurance2', () => {
      expectResult(component, '.remainingInsurance2', 50);
    });

    it('remainingInsurance3A', () => {
      expectResult(component, '.remainingInsurance3A', 60);
    });
  });

  context('structure with an offer', () => {
    beforeEach(() => {
      const structure = {
        id: 'a',
        loanTranches: [
          { type: 'interest2', value: 0.8 },
          { type: 'interestLibor', value: 0.2 },
        ],
        propertyId: 'house',
        offerId: 'offer',
        propertyWork: 200000,
        wantedLoan: 1080000,
        notaryFees: 50000,
        ownFunds: [
          { type: 'bankFortune', value: 150000, borrowerId: 'John' },
          {
            type: 'insurance2',
            usageType: OWN_FUNDS_USAGE_TYPES.PLEDGE,
            value: 120000,
            borrowerId: 'John',
          },
          { type: 'thirdPartyFortune', value: 20000, borrowerId: 'Mary' },
        ],
      };
      loan = {
        selectedStructure: 'a',
        structure,
        structures: [structure],
        borrowers: [
          {
            _id: 'John',
            bankFortune: 250000,
            salary: 200000,
            insurance2: [{ value: 1000 }],
            insurance3A: [{ value: 500 }],
          },
          {
            _id: 'Mary',
            salary: 200000,
            thirdPartyFortune: [{ value: 200000 }],
            insurance2: [{ value: 2000 }],
            insurance3A: [{ value: 0 }],
          },
        ],
        properties: [
          {
            _id: 'house',
            value: 1000000,
            yearlyExpenses: 1200,
          },
        ],
        offers: [
          {
            _id: 'offer',
            interest2: 0.02,
            interestLibor: 0.01,
            amortizationGoal: 0.5,
            amortizationYears: 5,
          },
        ],
        currentInterestRates: { [INTEREST_RATES.YEARS_10]: 0.01 },
      };
    });

    it('monthly', () => {
      const monthly = component().find('.financing-structures-result-chart .total');
      const string = monthly.text();
      const value = string.match(/\d/g).join('');
      expect(value).to.equal('9720');
    });

    it('interestsCost', () => {
      const interestsCost = component()
        .find('.interestsCost')
        .last();
      const string = interestsCost.text();
      const value = string.match(/\d/g).join('');

      // Average of 1.8% interests
      expect(value).to.equal('1620');
    });

    it('amortizationCost', () => {
      // 1080k in 5 years to 600k
      expectResult(component, '.amortizationCost', '8 000');
    });

    it('propertyCost', () => {
      expectResult(component, '.propertyCost', 100);
    });

    it('borrowRatio', () => {
      expectResult(component, '.borrowRatio', 0.9);
    });

    it('incomeRatio', () => {
      // 400k income
      // 12k maintenance, 54k interests, 20k amortization
      expectResult(component, '.incomeRatio', 0.315);
    });

    it('remainingCash', () => {
      expectResult(component, '.remainingCash', '100 000');
    });

    it('remainingInsurance2', () => {
      expectResult(component, '.remainingInsurance2', '3 000');
    });

    it('remainingInsurance3A', () => {
      expectResult(component, '.remainingInsurance3A', 500);
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
