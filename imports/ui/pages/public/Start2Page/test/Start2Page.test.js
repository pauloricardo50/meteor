/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent } from '/imports/js/helpers/testHelpers';

import Start2Page from '../Start2Page';
import StartResult from '../StartResult';

if (Meteor.isClient) {
  describe('<Start2Page />', () => {
    let props;
    let state;
    const component = () => getMountedComponent(Start2Page, props);

    beforeEach(() => {
      props = {
        match: {
          params: {
            type: 'acquisition',
          },
        },
        location: {
          search: '',
        },
        history: {},
      };

      state = {
        age: 23,
        bonusExists: false,
        borrowerCount: 1,
        expensesExists: false,
        finalized: true,
        fortune1: 250000,
        fortuneRequiredAgreed: true,
        fortuneUsed: 250000,
        income1: 200000,
        initialFortune: 250000,
        initialFortuneAgreed: true,
        initialIncome: 200000,
        initialIncomeAgreed: true,
        insurance1Exists: false,
        insurance11: 0,
        insurance2Exists: false,
        insuranceFortuneUsed: 0,
        knowsProperty: true,
        loanWanted: 800000,
        notaryFeesAgreed: true,
        otherIncomeExists: false,
        propertyValue: 1000000,
        propertyWorkExists: false,
        purchaseType: 'acquisition',
        realEstateExists: false,
        showUX: false,
        type: 'acquisition',
        usageType: 'primary',
        useInsurance: false,
      };

      getMountedComponent.reset();
    });

    it('Always renders a ux-text div', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
      expect(divs.first().hasClass('ux-text')).to.equal(true);
    });

    it('Gets to the end with basic answers', () => {
      component().setState(state, () =>
        expect(component().find(StartResult).length).to.equal(1),
      );
    });
  });
}
