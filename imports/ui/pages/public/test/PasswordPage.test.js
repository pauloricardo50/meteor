import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import PasswordPage from '../PasswordPage.jsx';

if (Meteor.isClient) {
  describe('<PasswordPage />', () => {
    let props;
    let mountedComponent;
    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(<PasswordPage {...props} />, {
          context: { muiTheme: getMuiTheme(myTheme) },
          childContextTypes: { muiTheme: PropTypes.object },
        });
      }
      return mountedComponent;
    };

    beforeEach(() => {
      mountedComponent = undefined;
    });

    it('Always renders a main', () => {
      const sections = component().find('main');

      expect(sections.length).to.be.at.least(1);
    });
  });
}
