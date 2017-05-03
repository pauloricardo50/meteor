import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Start2Page from '../Start2Page.jsx';
import StartResult from '../startPage/StartResult.jsx';

if (Meteor.isClient) {
  describe('<Start2Page />', () => {
    let props;
    let state;
    let mountedComponent;

    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(<Start2Page {...props} />, {
          context: { muiTheme: getMuiTheme(myTheme) },
          childContextTypes: { muiTheme: PropTypes.object },
        });
      }
      return mountedComponent;
    };

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
      };

      state = {
        age: 23,
        bonusExists: false,
        borrowerCount: 1,
        expensesExist: false,
        finalized: true,
        fortune1: 250000,
        fortuneRequiredAgreed: true,
        fortuneUsed: 250000,
        income1: 200000,
        initialFortune: 250000,
        initialFortuneAgreed: true,
        initialIncome: 200000,
        initialIncomeAgreed: true,
        insurance11: 0,
        insurance2Exists: false,
        insuranceFortuneUsed: 0,
        knowsProperty: true,
        loanWanted: 800000,
        notaryFeesAgreed: true,
        otherIncome: false,
        propertyValue: 1000000,
        propertyWorkExists: false,
        purchaseType: 'acquisition',
        realEstateExists: false,
        showUX: false,
        type: 'acquisition',
        usageType: 'primary',
        useInsurance: false,
      };

      mountedComponent = undefined;
    });

    it('Always renders a ux-text div', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
      expect(divs.first().hasClass('ux-text')).to.be.true;
    });

    it('Gets to the end with basic answers', () => {
      component().setState(state, () => expect(component().find(StartResult).length).to.equal(1));
    });
  });
}
