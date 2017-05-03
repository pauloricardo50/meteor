import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import LenderPickerPage from '../LenderPickerPage.jsx';
import AmortizingPicker from '../lenderPickerPage/AmortizingPicker.jsx';
import LoanStrategyPicker from '../lenderPickerPage/LoanStrategyPicker.jsx';
import LenderTable from '../lenderPickerPage/LenderTable.jsx';

import { getLoanValue } from '/imports/js/helpers/requestFunctions';

if (Meteor.isClient) {
  describe('<LenderPickerPage />', () => {
    let props;
    let mountedComponent;
    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(<LenderPickerPage {...props} />, {
          context: { muiTheme: getMuiTheme(myTheme) },
          childContextTypes: { muiTheme: PropTypes.object },
        });
      }
      return mountedComponent;
    };

    beforeEach(() => {
      props = {
        loanRequest: {
          logic: {},
          general: { fortuneUsed: 250000 },
          property: { value: 1000000 },
        },
        borrowers: [{ logic: {} }],
        offers: [
          {
            standardOffer: {
              maxAmount: 800000,
              amortization: 0.01,
              interestLibor: 0.01,
            },
            counterpartOffer: {
              maxAmount: 800000,
              amortization: 0.008,
              interestLibor: 0.008,
            },
            conditions: ['Conditions'],
            counterparts: [],
          },
        ],
      };
      mountedComponent = undefined;
    });

    it('Always renders a section', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
    });

    it('Renders the AmortizingPicker if the user has already chosen a lender', () => {
      props.loanRequest.logic.lender = { offerId: 'someId' };
      expect(component().find(AmortizingPicker).length).to.equal(1);
    });

    it('Renders the LoanStrategyPicker if the user has already chosen an amortization strategy', () => {
      props.loanRequest.logic.hasChosenLender = true;
      props.loanRequest.logic.lender = { offerId: 'someId' };
      props.loanRequest.logic.insuranceUsePreset = 'collateral';
      props.loanRequest.logic.amortizationStrategyPreset = 'indirect';
      expect(component().find(LoanStrategyPicker).length).to.equal(1);
    });

    it('Renders the LenderTable if the user has properly chosen his loan Strategy', () => {
      props.loanRequest.logic.lender = { offerId: 'someId' };
      props.loanRequest.logic.amortizationStrategyPreset = 'indirect';
      props.loanRequest.logic.loanStrategyPreset = 'fixed';
      props.loanRequest.general.loanTranches = [
        { type: 'libor', value: getLoanValue(props.loanRequest) },
      ];

      expect(component().find(LenderTable).length).to.equal(1);
    });
  });
}
