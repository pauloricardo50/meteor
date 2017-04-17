import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AboutPage from '../AboutPage.jsx';

if (Meteor.isClient) {
  describe('<AboutPage />', () => {
    let props;
    let mountedComponent;
    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(<AboutPage {...props} />, {
          context: { muiTheme: getMuiTheme(myTheme) },
          childContextTypes: { muiTheme: PropTypes.object },
        });
      }
      return mountedComponent;
    };

    beforeEach(() => {
      mountedComponent = undefined;
    });

    it('Always renders a section', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
    });
  });
}
